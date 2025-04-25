<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Transaction;


class Wallet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'balance',
        'account_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function sentTransfers()
    {
        return $this->hasMany(Transaction::class, 'sender_id');
    }

    public function receivedTransfers()
    {
        return $this->hasMany(Transaction::class, 'receiver_id');
    }
}
