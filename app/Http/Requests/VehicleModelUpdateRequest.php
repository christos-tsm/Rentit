<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleModelUpdateRequest extends FormRequest
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
            'vehicle_make_id' => ['required', 'integer', 'exists:vehicle_makes,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('vehicle_models')
                    ->where('vehicle_make_id', $this->input('vehicle_make_id'))
                    ->ignore($this->route('vehicleModel')),
            ],
        ];
    }
}
