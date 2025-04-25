<?php

namespace App\Observers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        Log::channel('transactions')->info('Transaction created', [
            'transaction_id' => $transaction->id,
            'wallet_id' => $transaction->wallet_id,
            'type' => $transaction->type,
            'amount' => $transaction->amount,
            'transaction_code' => $transaction->transaction_code,
            'sender_id' => $transaction->sender_id,
            'receiver_id' => $transaction->receiver_id,
        ]);
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        Log::channel('transactions')->info('Transaction updated', [
            'transaction_id' => $transaction->id,
            'changes' => $transaction->getChanges(),
        ]);
    }
}