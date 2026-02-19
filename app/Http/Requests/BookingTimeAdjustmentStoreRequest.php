<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingTimeAdjustmentStoreRequest extends FormRequest
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
            'type' => ['required', 'in:early_bird,last_minute'],
            'min_days_before' => ['required', 'integer', 'min:0'],
            'max_days_before' => ['nullable', 'integer', 'min:0'],
            'adjustment_type' => ['required', 'in:discount,surcharge'],
            'percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['boolean'],
        ];
    }
}
