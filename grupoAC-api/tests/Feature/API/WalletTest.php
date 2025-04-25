<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    protected $walletService;

    public function setUp(): void
    {
        parent::setUp();
        $this->walletService = app(WalletService::class);
    }

    public function test_user_can_get_balance()
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/wallet/balance');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'wallet' => [
                    'id' => $wallet->id,
                    'balance' => 0.00,
                    'account_number' => $wallet->account_number,
                ],
            ]);
    }

    public function test_user_can_deposit()
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/wallet/deposit', [
                'amount' => 100.00,
                'description' => 'Depósito de teste',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Depósito realizado com sucesso',
                'new_balance' => 100.00,
            ]);

        $this->assertDatabaseHas('transactions', [
            'wallet_id' => $wallet->id,
            'type' => 'deposit',
            'amount' => 100.00,
            'description' => 'Depósito de teste',
        ]);

        $this->assertDatabaseHas('wallets', [
            'id' => $wallet->id,
            'balance' => 100.00,
        ]);
    }

    public function test_user_can_transfer()
    {
        // Criando usuário e carteira remetente com saldo
        $sender = User::factory()->create(['email' => 'sender@example.com']);
        $senderWallet = $this->walletService->createWallet($sender);
        $this->walletService->deposit($senderWallet, 200.00);
        
        // Criando usuário e carteira destinatária
        $receiver = User::factory()->create(['email' => 'receiver@example.com']);
        $receiverWallet = $this->walletService->createWallet($receiver);
        
        $token = $sender->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/wallet/transfer', [
                'receiver_account' => $receiverWallet->account_number,
                'amount' => 50.00,
                'description' => 'Transferência de teste',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Transferência realizada com sucesso',
                'new_balance' => 150.00,
            ]);

        $this->assertDatabaseHas('transactions', [
            'wallet_id' => $senderWallet->id,
            'type' => 'transfer_out',
            'amount' => 50.00,
        ]);

        $this->assertDatabaseHas('transactions', [
            'wallet_id' => $receiverWallet->id,
            'type' => 'transfer_in',
            'amount' => 50.00,
        ]);

        $this->assertDatabaseHas('wallets', [
            'id' => $senderWallet->id,
            'balance' => 150.00,
        ]);

        $this->assertDatabaseHas('wallets', [
            'id' => $receiverWallet->id,
            'balance' => 50.00,
        ]);
    }

    public function test_user_cannot_transfer_with_insufficient_balance()
    {
        // Criando usuário e carteira remetente com saldo insuficiente
        $sender = User::factory()->create(['email' => 'poor@example.com']);
        $senderWallet = $this->walletService->createWallet($sender);
        $this->walletService->deposit($senderWallet, 30.00);
        
        // Criando usuário e carteira destinatária
        $receiver = User::factory()->create(['email' => 'rich@example.com']);
        $receiverWallet = $this->walletService->createWallet($receiver);
        
        $token = $sender->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/wallet/transfer', [
                'receiver_account' => $receiverWallet->account_number,
                'amount' => 50.00,
                'description' => 'Transferência impossível',
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Saldo insuficiente para realizar a transferência.',
            ]);

        $this->assertDatabaseHas('wallets', [
            'id' => $senderWallet->id,
            'balance' => 30.00,
        ]);

        $this->assertDatabaseHas('wallets', [
            'id' => $receiverWallet->id,
            'balance' => 0.00,
        ]);
    }

    public function test_user_can_reverse_transaction()
    {
        // Criando usuário e carteira remetente com saldo
        $sender = User::factory()->create(['email' => 'user1@example.com']);
        $senderWallet = $this->walletService->createWallet($sender);
        $this->walletService->deposit($senderWallet, 200.00);
        
        // Criando usuário e carteira destinatária
        $receiver = User::factory()->create(['email' => 'user2@example.com']);
        $receiverWallet = $this->walletService->createWallet($receiver);
        
        // Realizando transferência
        $transactions = $this->walletService->transfer($senderWallet, $receiverWallet, 50.00);
        $transactionId = $transactions['out']->id;
        
        $token = $sender->createToken('auth_token')->plainTextToken;

        // Revertendo a transação
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/wallet/transactions/{$transactionId}/reverse", [
                'description' => 'Estorno de teste',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Transação revertida com sucesso',
            ]);

        // Verificar se os saldos voltaram ao normal
        $this->assertDatabaseHas('wallets', [
            'id' => $senderWallet->id,
            'balance' => 200.00,
        ]);

        $this->assertDatabaseHas('wallets', [
            'id' => $receiverWallet->id,
            'balance' => 0.00,
        ]);

        // Verificar se as transações de reversão foram criadas
        $this->assertDatabaseHas('transactions', [
            'type' => 'reversal',
            'related_transaction_id' => $transactionId,
        ]);
    }
}
