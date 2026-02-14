<?php

namespace App\Repositories;

use App\DTO\Requests\VehicleRequestDTO;
use App\Models\Vehicle;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleRepository
{
    public function getVehicles(VehicleRequestDTO $vehicleRequestDTO): LengthAwarePaginator
    {
        $query = Vehicle::query()
            ->with(['vehicleModel.make', 'category']);

        if ($vehicleRequestDTO->id) {
            $query->where('id', $vehicleRequestDTO->id);
        }

        if ($vehicleRequestDTO->makeId) {
            $query->whereHas('vehicleModel', fn ($q) => $q->where('vehicle_make_id', $vehicleRequestDTO->makeId));
        }

        if ($vehicleRequestDTO->searchKey) {
            $search = $vehicleRequestDTO->searchKey;
            $query->where(function ($q) use ($search) {
                $q->where('plate_number', 'like', '%'.$search.'%')
                    ->orWhereHas('vehicleModel', fn ($sub) => $sub->where('name', 'like', '%'.$search.'%'))
                    ->orWhereHas('vehicleModel.make', fn ($sub) => $sub->where('name', 'like', '%'.$search.'%'));
            });
        }

        return $query->paginate($vehicleRequestDTO->rpp);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Vehicle
    {
        return Vehicle::create($data);
    }
}
