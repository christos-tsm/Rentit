<?php

namespace App\Http\Requests;

use App\DTO\Requests\VehicleRequestDTO;
use Illuminate\Foundation\Http\FormRequest;

class VehicleIndexRequest extends FormRequest
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
            'search' => ['nullable', 'string', 'max:255'],
            'make_id' => ['nullable', 'integer', 'exists:vehicle_makes,id'],
            'category_id' => ['nullable', 'integer', 'exists:vehicle_categories,id'],
            'status' => ['nullable', 'string', 'in:available,rented,maintenance,out_of_service'],
            'rpp' => ['nullable', 'integer', 'min:1', 'max:100'],
            'id' => ['nullable', 'integer', 'exists:vehicles,id'],
        ];
    }

    public function toDTO(): VehicleRequestDTO
    {
        $args = [
            'searchKey' => $this->validated('search'),
            'makeId' => $this->validated('make_id'),
            'categoryId' => $this->validated('category_id'),
            'status' => $this->validated('status'),
            'id' => $this->validated('id'),
        ];

        $rpp = $this->validated('rpp');
        if ($rpp !== null) {
            $args['rpp'] = (int) $rpp;
        }

        return new VehicleRequestDTO(...$args);
    }
}
