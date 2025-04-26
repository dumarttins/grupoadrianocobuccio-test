<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'wallet_id',
        'type',
        'amount',
        'previous_balance',
        'new_balance',
        'description',
        'transaction_code',
        'related_transaction_id',
        'sender_id',
        'receiver_id',
    ];

    /**
     * Get the wallet that owns the transaction.
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * Get the related transaction.
     */
    public function relatedTransaction()
    {
        return $this->belongsTo(Transaction::class, 'related_transaction_id');
    }

    /**
     * Get the reversals for the transaction.
     */
    public function reversals()
    {
        return $this->hasMany(Transaction::class, 'related_transaction_id');
    }

    /**
     * Get the sender wallet.
     */
    public function sender()
    {
        return $this->belongsTo(Wallet::class, 'sender_id');
    }

    /**
     * Get the receiver wallet.
     */
    public function receiver()
    {
        return $this->belongsTo(Wallet::class, 'receiver_id');
    }
}