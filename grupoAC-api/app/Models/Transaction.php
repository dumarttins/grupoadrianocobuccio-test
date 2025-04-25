<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

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

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function relatedTransaction()
    {
        return $this->belongsTo(Transaction::class, 'related_transaction_id');
    }

    public function reversals()
    {
        return $this->hasMany(Transaction::class, 'related_transaction_id');
    }

    public function sender()
    {
        return $this->belongsTo(Wallet::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(Wallet::class, 'receiver_id');
    }
}