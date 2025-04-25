<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class ReverseTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'description' => 'nullable|string|max:255',
        ];
    }
}