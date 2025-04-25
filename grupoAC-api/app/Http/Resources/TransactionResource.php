<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'amount' => $this->amount,
            'previous_balance' => $this->previous_balance,
            'new_balance' => $this->new_balance,
            'description' => $this->description,
            'transaction_code' => $this->transaction_code,
            'wallet_id' => $this->wallet_id,
            'related_transaction_id' => $this->related_transaction_id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'sender' => $this->whenLoaded('sender', function () {
                return new WalletResource($this->sender);
            }),
            'receiver' => $this->whenLoaded('receiver', function () {
                return new WalletResource($this->receiver);
            }),
        ];
    }
}