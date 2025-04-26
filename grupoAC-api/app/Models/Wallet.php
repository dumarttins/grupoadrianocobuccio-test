<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wallet extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'balance',
        'account_number',
    ];

    /**
     * Get the user that owns the wallet.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the wallet.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the transfers sent from this wallet.
     */
    public function sentTransfers()
    {
        return $this->hasMany(Transaction::class, 'sender_id');
    }

    /**
     * Get the transfers received by this wallet.
     */
    public function receivedTransfers()
    {
        return $this->hasMany(Transaction::class, 'receiver_id');
    }
}