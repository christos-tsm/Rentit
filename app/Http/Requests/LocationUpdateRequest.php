<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LocationUpdateRequest extends FormRequest
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
            'address' => ['nullable', 'string', 'max:500'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'coordinates' => ['nullable', 'string', 'max:100'],
            'operating_hours' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:airport,office,hotel,port,other'],
            'is_active' => ['boolean'],
        ];
    }
}
