<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained();
            $table->enum('type', ['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'reversal']);
            $table->decimal('amount', 15, 2);
            $table->decimal('previous_balance', 15, 2);
            $table->decimal('new_balance', 15, 2);
            $table->string('description')->nullable();
            $table->uuid('transaction_code')->unique();
            $table->foreignId('related_transaction_id')->nullable()->constrained('transactions');
            $table->foreignId('sender_id')->nullable()->constrained('wallets');
            $table->foreignId('receiver_id')->nullable()->constrained('wallets');
            $table->timestamps();
            $table->softDeletes();
            $table->index('wallet_id');
            $table->index('transaction_code');
            $table->index(['sender_id', 'receiver_id']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
