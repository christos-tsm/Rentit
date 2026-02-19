<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DriverAgeSurchargeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'min_age' => ['required', 'integer', 'min:16', 'max:100'],
            'max_age' => ['required', 'integer', 'min:16', 'max:100'],
            'surcharge_type' => ['required', 'in:fixed,percentage'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
