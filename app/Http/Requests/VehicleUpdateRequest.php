<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleUpdateRequest extends FormRequest
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
            'vehicle_category_id' => ['required', 'integer', 'exists:vehicle_categories,id'],
            'vehicle_model_id' => ['required', 'integer', 'exists:vehicle_models,id'],
            'plate_number' => ['required', 'string', 'max:20', Rule::unique('vehicles', 'plate_number')->ignore($this->route('vehicle'))],
            'cc' => ['required', 'integer', 'min:1'],
            'seats' => ['required', 'integer', 'min:1', 'max:50'],
            'large_bags_capacity' => ['required', 'integer', 'min:0'],
            'small_bags_capacity' => ['required', 'integer', 'min:0'],
            'doors' => ['required', 'integer', 'min:1', 'max:10'],
            'ac' => ['required', 'boolean'],
            'gears' => ['required', 'integer', 'min:1', 'max:12'],
            'hp' => ['required', 'integer', 'min:1'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'vin' => ['nullable', 'string', 'max:17', Rule::unique('vehicles', 'vin')->ignore($this->route('vehicle'))],
            'fuel_type' => ['required', Rule::in(['petrol', 'diesel', 'electric', 'hybrid'])],
            'transmission' => ['required', Rule::in(['manual', 'automatic'])],
            'status' => ['sometimes', Rule::in(['available', 'rented', 'maintenance', 'out_of_service'])],
            'current_km' => ['required', 'integer', 'min:0'],
        ];
    }
}
