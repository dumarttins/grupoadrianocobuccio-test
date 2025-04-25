<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class WalletServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $walletService;

    public function setUp(): void
    {
        parent::setUp();
        $this->walletService = app(WalletService::class);
    }

    public function test_create_wallet()
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $this->assertNotNull($wallet);
        $this->assertEquals($user->id, $wallet->user_id);
        $this->assertEquals(0.00, $wallet->balance);
        $this->assertNotNull($wallet->account_number);
        $this->assertTrue(strlen($wallet->account_number) === 10);
    }

    public function test_cannot_create_duplicate_wallet()
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Usuário já possui uma carteira.');

        $user = User::factory()->create();
        $this->walletService->createWallet($user);
        // Tentar criar uma segunda carteira para o mesmo usuário
        $this->walletService->createWallet($user);
    }

    public function test_deposit()
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $transaction = $this->walletService->deposit($wallet, 100.00, 'Teste de depósito');

        $wallet->refresh();
        $this->assertEquals(100.00, $wallet->balance);
        $this->assertEquals('deposit', $transaction->type);
        $this->assertEquals(100.00, $transaction->amount);
        $this->assertEquals(0.00, $transaction->previous_balance);
        $this->assertEquals(100.00, $transaction->new_balance);
        $this->assertEquals('Teste de depósito', $transaction->description);
    }

    public function test_cannot_deposit_negative_amount()
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('O valor do depósito deve ser maior que zero.');

        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);
        $this->walletService->deposit($wallet, -50.00);
    }

    public function test_transfer()
    {
        // Remetente
        $sender = User::factory()->create(['email' => 'sender@example.com']);
        $senderWallet = $this->walletService->createWallet($sender);
        $this->walletService->deposit($senderWallet, 500.00);

        // Destinatário
        $receiver = User::factory()->create(['email' => 'receiver@example.com']);
        $receiverWallet = $this->walletService->createWallet($receiver);

        // Transferência
        $transactions = $this->walletService->transfer(
            $senderWallet,
            $receiverWallet,
            200.00,
            'Transferência de teste'
        );

        // Verificar carteiras
        $senderWallet->refresh();
        $receiverWallet->refresh();

        $this->assertEquals(300.00, $senderWallet->balance);
        $this->assertEquals(200.00, $receiverWallet->balance);

        // Verificar transações
        $this->assertEquals('transfer_out', $transactions['out']->type);
        $this->assertEquals('transfer_in', $transactions['in']->type);
        $this->assertEquals(200.00, $transactions['out']->amount);
        $this->assertEquals(200.00, $transactions['in']->amount);
        $this->assertEquals($senderWallet->id, $transactions['out']->sender_id);
        $this->assertEquals($receiverWallet->id, $transactions['out']->receiver_id);
    }

    public function test_cannot_transfer_with_insufficient_balance()
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Saldo insuficiente para realizar a transferência.');

        // Remetente com saldo insuficiente
        $sender = User::factory()->create();
        $senderWallet = $this->walletService->createWallet($sender);
        $this->walletService->deposit($senderWallet, 50.00);

        // Destinatário
        $receiver = User::factory()->create();
        $receiverWallet = $this->walletService->createWallet($receiver);

        // Tentar transferir mais do que tem
        $this->walletService->transfer($senderWallet, $receiverWallet, 100.00);
    }

    public function test_cannot_transfer_to_same_wallet()
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Não é possível transferir para a mesma carteira.');

        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);
        $this->walletService->deposit($wallet, 100.00);

        // Tentar transferir para a mesma carteira
        $this->walletService->transfer($wallet, $wallet, 50.00);
    }

    public function test_reverse_deposit()
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);
        
        // Fazer um depósito
        $transaction = $this->walletService->deposit($wallet, 200.00);
        
        // Reverter o depósito
        $reversals = $this->walletService->reverseTransaction($transaction, 'Estorno de teste');
        
        // Verificar carteira
        $wallet->refresh();
        $this->assertEquals(0.00, $wallet->balance);
        
        // Verificar reversão
        $this->assertArrayHasKey('reversal', $reversals);
        $this->assertEquals('reversal', $reversals['reversal']->type);
        $this->assertEquals(200.00, $reversals['reversal']->amount);
        $this->assertEquals($transaction->id, $reversals['reversal']->related_transaction_id);
    }

    public function test_reverse_transfer()
    {
        // Remetente
        $sender = User::factory()->create();
        $senderWallet = $this->walletService->createWallet($sender);
        $this->walletService->deposit($senderWallet, 500.00);

        // Destinatário
        $receiver = User::factory()->create();
        $receiverWallet = $this->walletService->createWallet($receiver);

        // Fazer transferência
        $transactions = $this->walletService->transfer($senderWallet, $receiverWallet, 200.00);
        
        // Reverter transferência
        $reversals = $this->walletService->reverseTransaction($transactions['out']);
        
        // Verificar carteiras
        $senderWallet->refresh();
        $receiverWallet->refresh();
        
        $this->assertEquals(500.00, $senderWallet->balance); // Voltou ao valor original
        $this->assertEquals(0.00, $receiverWallet->balance);
        
        // Verificar reversões
        $this->assertArrayHasKey('sender_reversal', $reversals);
        $this->assertArrayHasKey('receiver_reversal', $reversals);
        $this->assertEquals('reversal', $reversals['sender_reversal']->type);
        $this->assertEquals('reversal', $reversals['receiver_reversal']->type);
    }

    public function test_cannot_reverse_already_reversed_transaction()
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Esta transação já foi revertida.');

        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);
        
        // Fazer um depósito
        $transaction = $this->walletService->deposit($wallet, 100.00);
        
        // Reverter o depósito uma vez
        $this->walletService->reverseTransaction($transaction);
        
        // Tentar reverter novamente
        $this->walletService->reverseTransaction($transaction);
    }
}