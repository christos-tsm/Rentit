<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PriceCalculationRequest extends FormRequest
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
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'pickup_date' => ['required', 'date'],
            'return_date' => ['required', 'date', 'after:pickup_date'],
            'pickup_location_id' => ['required', 'exists:locations,id'],
            'return_location_id' => ['required', 'exists:locations,id'],
            'driver_age' => ['nullable', 'integer', 'min:16', 'max:100'],
            'extras' => ['nullable', 'array'],
            'extras.*.extra_id' => ['required_with:extras', 'exists:extras,id'],
            'extras.*.quantity' => ['required_with:extras', 'integer', 'min:1'],
        ];
    }
}
