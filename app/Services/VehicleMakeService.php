<?php

namespace App\Services;

use App\Models\VehicleMake;
use App\Repositories\VehicleMakeRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleMakeService
{
    public function __construct(
        private VehicleMakeRepository $vehicleMakeRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->vehicleMakeRepository->getAll($perPage);
    }

    public function getForSelect(): Collection
    {
        return $this->vehicleMakeRepository->getForSelect();
    }

    public function create(string $name): VehicleMake
    {
        return $this->vehicleMakeRepository->create($name);
    }

    public function update(VehicleMake $vehicleMake, string $name): VehicleMake
    {
        return $this->vehicleMakeRepository->update($vehicleMake, $name);
    }

    public function delete(VehicleMake $vehicleMake): void
    {
        $this->vehicleMakeRepository->delete($vehicleMake);
    }
}
