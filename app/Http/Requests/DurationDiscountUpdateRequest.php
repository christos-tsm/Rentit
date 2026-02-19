<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DurationDiscountUpdateRequest extends FormRequest
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
            'min_days' => ['required', 'integer', 'min:1'],
            'max_days' => ['nullable', 'integer', 'min:1'],
            'discount_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['boolean'],
        ];
    }
}
