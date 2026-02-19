<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class YieldRuleStoreRequest extends FormRequest
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
            'min_available_vehicles' => ['required', 'integer', 'min:1'],
            'price_increase_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['boolean'],
        ];
    }
}
