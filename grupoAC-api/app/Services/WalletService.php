<?php

// app/Services/WalletService.php
namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class WalletService
{
    /**
     * Cria uma nova carteira para um usuário
     */
    public function createWallet(User $user): Wallet
    {
        // Verificar se o usuário já tem uma carteira
        if ($user->wallet) {
            throw new InvalidArgumentException('Usuário já possui uma carteira.');
        }

        return DB::transaction(function () use ($user) {
            // Gerar número de conta único (10 dígitos)
            $accountNumber = $this->generateUniqueAccountNumber();

            return $user->wallet()->create([
                'balance' => 0.00,
                'account_number' => $accountNumber,
            ]);
        });
    }

    /**
     * Deposita dinheiro na carteira
     */
    public function deposit(Wallet $wallet, float $amount, string $description = null): Transaction
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('O valor do depósito deve ser maior que zero.');
        }

        return DB::transaction(function () use ($wallet, $amount, $description) {
            $previousBalance = $wallet->balance;
            $newBalance = $previousBalance + $amount;

            // Atualizar saldo da carteira
            $wallet->balance = $newBalance;
            $wallet->save();

            // Registrar transação
            return Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'deposit',
                'amount' => $amount,
                'previous_balance' => $previousBalance,
                'new_balance' => $newBalance,
                'description' => $description ?? 'Depósito',
                'transaction_code' => $this->generateTransactionCode(),
            ]);
        });
    }

    /**
     * Transfere dinheiro entre carteiras
     */
    public function transfer(Wallet $sender, Wallet $receiver, float $amount, string $description = null): array
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('O valor da transferência deve ser maior que zero.');
        }

        if ($sender->id === $receiver->id) {
            throw new InvalidArgumentException('Não é possível transferir para a mesma carteira.');
        }

        if ($sender->balance < $amount) {
            throw new InvalidArgumentException('Saldo insuficiente para realizar a transferência.');
        }

        return DB::transaction(function () use ($sender, $receiver, $amount, $description) {
            // Gerar código de transação único
            $transferCodeBase = $this->generateTransactionCode();
            $outTransactionCode = $transferCodeBase . '-out';
            $inTransactionCode = $transferCodeBase . '-in';
            
            // Atualizar saldo do remetente
            $senderPreviousBalance = $sender->balance;
            $senderNewBalance = $senderPreviousBalance - $amount;
            $sender->balance = $senderNewBalance;
            $sender->save();

            // Registrar transação de saída
            $outTransaction = Transaction::create([
                'wallet_id' => $sender->id,
                'type' => 'transfer_out',
                'amount' => $amount,
                'previous_balance' => $senderPreviousBalance,
                'new_balance' => $senderNewBalance,
                'description' => $description ?? 'Transferência enviada',
                'transaction_code' => $outTransactionCode, // Código único para saída
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
            ]);

            // Atualizar saldo do destinatário
            $receiverPreviousBalance = $receiver->balance;
            $receiverNewBalance = $receiverPreviousBalance + $amount;
            $receiver->balance = $receiverNewBalance;
            $receiver->save();

            // Registrar transação de entrada
            $inTransaction = Transaction::create([
                'wallet_id' => $receiver->id,
                'type' => 'transfer_in',
                'amount' => $amount,
                'previous_balance' => $receiverPreviousBalance,
                'new_balance' => $receiverNewBalance,
                'description' => $description ?? 'Transferência recebida',
                'transaction_code' => $inTransactionCode, // Código único para entrada
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'related_transaction_id' => $outTransaction->id,
            ]);

            // Relacionar as transações
            $outTransaction->related_transaction_id = $inTransaction->id;
            $outTransaction->save();

            return [
                'out' => $outTransaction,
                'in' => $inTransaction,
            ];
        });
    }

    /**
     * Reverte uma transação
     */
    public function reverseTransaction(Transaction $transaction, string $description = null): array
    {
        // Verificar se a transação já foi revertida
        if ($transaction->reversals()->exists()) {
            throw new InvalidArgumentException('Esta transação já foi revertida.');
        }

        return DB::transaction(function () use ($transaction, $description) {
            $result = [];

            // Reverter com base no tipo de transação
            switch ($transaction->type) {
                case 'deposit':
                    // Reverter um depósito (sacar o valor)
                    $wallet = $transaction->wallet;
                    $amount = $transaction->amount;

                    if ($wallet->balance < $amount) {
                        throw new InvalidArgumentException('Saldo insuficiente para reverter esta transação.');
                    }

                    $previousBalance = $wallet->balance;
                    $newBalance = $previousBalance - $amount;
                    
                    $wallet->balance = $newBalance;
                    $wallet->save();

                    $result['reversal'] = Transaction::create([
                        'wallet_id' => $wallet->id,
                        'type' => 'reversal',
                        'amount' => $amount,
                        'previous_balance' => $previousBalance,
                        'new_balance' => $newBalance,
                        'description' => $description ?? 'Estorno de depósito',
                        'transaction_code' => $this->generateTransactionCode(),
                        'related_transaction_id' => $transaction->id,
                    ]);
                    break;

                case 'transfer_out':
                case 'transfer_in':
                    $relatedTransaction = $transaction->type === 'transfer_out' 
                        ? $transaction->relatedTransaction 
                        : Transaction::find($transaction->related_transaction_id);
                    
                    if (!$relatedTransaction) {
                        throw new InvalidArgumentException('Transação relacionada não encontrada.');
                    }

                    // Obter carteiras envolvidas
                    $sender = $transaction->sender;
                    $receiver = $transaction->receiver;
                    $amount = $transaction->amount;

                    // Verificar se o destinatário tem saldo suficiente para reverter
                    if ($receiver->balance < $amount) {
                        throw new InvalidArgumentException('Saldo insuficiente na carteira do destinatário para reverter esta transferência.');
                    }

                    // Atualizar saldo do destinatário (remover o valor)
                    $receiverPreviousBalance = $receiver->balance;
                    $receiverNewBalance = $receiverPreviousBalance - $amount;
                    $receiver->balance = $receiverNewBalance;
                    $receiver->save();

                    // Registrar reversão para o destinatário
                    $receiverReversal = Transaction::create([
                        'wallet_id' => $receiver->id,
                        'type' => 'reversal',
                        'amount' => $amount,
                        'previous_balance' => $receiverPreviousBalance,
                        'new_balance' => $receiverNewBalance,
                        'description' => $description ?? 'Estorno de transferência recebida',
                        'transaction_code' => $this->generateTransactionCode(),
                        'related_transaction_id' => $transaction->type === 'transfer_in' ? $transaction->id : $relatedTransaction->id,
                        'sender_id' => $receiver->id,
                        'receiver_id' => $sender->id,
                    ]);

                    // Atualizar saldo do remetente (adicionar o valor de volta)
                    $senderPreviousBalance = $sender->balance;
                    $senderNewBalance = $senderPreviousBalance + $amount;
                    $sender->balance = $senderNewBalance;
                    $sender->save();

                    // Registrar reversão para o remetente
                    $senderReversal = Transaction::create([
                        'wallet_id' => $sender->id,
                        'type' => 'reversal',
                        'amount' => $amount,
                        'previous_balance' => $senderPreviousBalance,
                        'new_balance' => $senderNewBalance,
                        'description' => $description ?? 'Estorno de transferência enviada',
                        'transaction_code' => $this->generateTransactionCode(),
                        'related_transaction_id' => $transaction->type === 'transfer_out' ? $transaction->id : $relatedTransaction->id,
                        'sender_id' => $receiver->id,
                        'receiver_id' => $sender->id,
                    ]);

                    $result['sender_reversal'] = $senderReversal;
                    $result['receiver_reversal'] = $receiverReversal;
                    break;

                default:
                    throw new InvalidArgumentException('Tipo de transação não suporta reversão.');
            }

            return $result;
        });
    }

    /**
     * Gera um código de transação único
     */
    private function generateTransactionCode(): string
    {
        return (string) Str::uuid();
    }

    /**
     * Gera um número de conta único
     */
    private function generateUniqueAccountNumber(): string
    {
        $accountNumber = '';
        $isUnique = false;

        while (!$isUnique) {
            // Gerar um número de conta de 10 dígitos
            $accountNumber = str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);

            // Verificar se já existe no banco de dados
            $exists = Wallet::where('account_number', $accountNumber)->exists();
            $isUnique = !$exists;
        }

        return $accountNumber;
    }
}