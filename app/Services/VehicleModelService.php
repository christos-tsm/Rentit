<?php

namespace App\Services;

use App\Models\VehicleModel;
use App\Repositories\VehicleModelRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleModelService
{
    public function __construct(
        private VehicleModelRepository $vehicleModelRepository,
    ) {}

    public function getAll(?int $vehicleMakeId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->vehicleModelRepository->getAll($vehicleMakeId, $perPage);
    }

    public function create(int $vehicleMakeId, string $name): VehicleModel
    {
        return $this->vehicleModelRepository->create($vehicleMakeId, $name);
    }

    public function update(VehicleModel $vehicleModel, int $vehicleMakeId, string $name): VehicleModel
    {
        return $this->vehicleModelRepository->update($vehicleModel, $vehicleMakeId, $name);
    }

    public function delete(VehicleModel $vehicleModel): void
    {
        $this->vehicleModelRepository->delete($vehicleModel);
    }
}
