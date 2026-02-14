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
            'rpp' => ['nullable', 'integer', 'min:1', 'max:100'],
            'id' => ['nullable', 'integer', 'exists:vehicles,id'],
        ];
    }

    public function toDTO(): VehicleRequestDTO
    {
        return new VehicleRequestDTO(
            searchKey: $this->validated('search'),
            makeId: $this->validated('make_id'),
            rpp: $this->validated('rpp') ?? 15,
            id: $this->validated('id'),
        );
    }
}
