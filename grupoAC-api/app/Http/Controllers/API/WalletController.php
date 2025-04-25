<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class WalletController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Exibir saldo da carteira
     */
    public function getBalance(Request $request)
    {
        $wallet = $request->user()->wallet;

        if (!$wallet) {
            return response()->json([
                'status' => 'error',
                'message' => 'Carteira não encontrada',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'wallet' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'account_number' => $wallet->account_number,
            ],
        ]);
    }

    /**
     * Depositar na carteira
     */
    public function deposit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados de validação inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $sender = $request->user()->wallet;

        if (!$sender) {
            return response()->json([
                'status' => 'error',
                'message' => 'Carteira do remetente não encontrada',
            ], 404);
        }

        // Obter carteira do destinatário
        $receiver = Wallet::where('account_number', $request->receiver_account)->first();

        if (!$receiver) {
            return response()->json([
                'status' => 'error',
                'message' => 'Carteira do destinatário não encontrada',
            ], 404);
        }

        // Verificar se é uma transferência para si mesmo
        if ($sender->id === $receiver->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Não é possível transferir para a própria carteira',
            ], 400);
        }

        try {
            $transactions = $this->walletService->transfer(
                $sender,
                $receiver,
                $request->amount,
                $request->description
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Transferência realizada com sucesso',
                'transactions' => $transactions,
                'new_balance' => $sender->fresh()->balance,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao processar transferência: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar transações da carteira
     */
    public function transactions(Request $request)
    {
        $wallet = $request->user()->wallet;

        if (!$wallet) {
            return response()->json([
                'status' => 'error',
                'message' => 'Carteira não encontrada',
            ], 404);
        }

        $transactions = $wallet->transactions()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'transactions' => $transactions,
        ]);
    }

    /**
     * Reverter uma transação
     */
    public function reverseTransaction(Request $request, $transactionId)
    {
        $wallet = $request->user()->wallet;

        if (!$wallet) {
            return response()->json([
                'status' => 'error',
                'message' => 'Carteira não encontrada',
            ], 404);
        }

        // Procurar transação
        $transaction = Transaction::where(function ($query) use ($wallet) {
            $query->where('wallet_id', $wallet->id)
                ->orWhere('sender_id', $wallet->id)
                ->orWhere('receiver_id', $wallet->id);
        })->find($transactionId);

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transação não encontrada',
            ], 404);
        }

        try {
            $reversals = $this->walletService->reverseTransaction(
                $transaction,
                $request->description ?? 'Estorno solicitado pelo usuário'
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Transação revertida com sucesso',
                'reversals' => $reversals,
                'new_balance' => $wallet->fresh()->balance,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao reverter transação: ' . $e->getMessage(),
            ], 500);
        }
    }
}válidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $wallet = $request->user()->wallet;

        if (!$wallet) {
            return response()->json([
                'status' => 'error',
                'message' => 'Carteira não encontrada',
            ], 404);
        }

        try {
            $transaction = $this->walletService->deposit(
                $wallet, 
                $request->amount, 
                $request->description
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Depósito realizado com sucesso',
                'transaction' => $transaction,
                'new_balance' => $wallet->fresh()->balance,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao processar depósito: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Transferir para outra carteira
     */
    public function transfer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_account' => 'required|string|exists:wallets,account_number',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados de validação in