<?php

namespace App\Services;

use App\DTO\Requests\VehicleRequestDTO;
use App\Models\Vehicle;
use App\Repositories\VehicleRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class VehicleService
{
    public function __construct(
        private VehicleRepository $vehicleRepository,
    ) {}

    public function getVehicles(VehicleRequestDTO $vehicleRequestDTO): ?LengthAwarePaginator
    {
        try {
            return $this->vehicleRepository->getVehicles($vehicleRequestDTO);
        } catch (\Exception $e) {
            Log::error('Error getting vehicles', ['error' => $e->getMessage()]);

            return null;
        }
    }

    public function getVehicle(VehicleRequestDTO $vehicleRequestDTO): ?Vehicle
    {
        try {
            return $this->vehicleRepository->getVehicle($vehicleRequestDTO);
        } catch (\Exception $e) {
            Log::error('Error getting vehicle', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Vehicle
    {
        return $this->vehicleRepository->create($data);
    }

    public function update(Vehicle $vehicle, array $data): ?Vehicle
    {
        try {
            return $this->vehicleRepository->update($vehicle, $data);
        } catch (\Exception $e) {
            Log::error('Error updating vehicle', ['error' => $e->getMessage()]);

            return null;
        }
    }
}
