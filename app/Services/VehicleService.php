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

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Vehicle
    {
        return $this->vehicleRepository->create($data);
    }
}
