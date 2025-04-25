<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class DepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
        ];
    }
}

// app/Http/Requests/API/TransferRequest.php
namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receiver_account' => 'required|string|exists:wallets,account_number',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
        ];
    }
}
