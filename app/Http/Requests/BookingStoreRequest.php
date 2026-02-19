<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingStoreRequest extends FormRequest
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
            'customer_id' => ['required', 'exists:customers,id'],
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'pickup_location_id' => ['required', 'exists:locations,id'],
            'return_location_id' => ['required', 'exists:locations,id'],
            'pickup_date' => ['required', 'date'],
            'return_date' => ['required', 'date', 'after:pickup_date'],
            'status' => ['nullable', 'in:pending,confirmed,active,completed,cancelled'],
            'driver_age' => ['nullable', 'integer', 'min:16', 'max:100'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'extras' => ['nullable', 'array'],
            'extras.*.extra_id' => ['required_with:extras', 'exists:extras,id'],
            'extras.*.quantity' => ['required_with:extras', 'integer', 'min:1'],
        ];
    }
}
