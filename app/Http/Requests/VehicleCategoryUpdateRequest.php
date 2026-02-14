<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleCategoryUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique('vehicle_categories', 'name')->ignore($this->route('category'))],
            'description' => ['nullable', 'string', 'max:1000'],
            'base_price_per_day' => ['required', 'numeric', 'min:0'],
        ];
    }
}
