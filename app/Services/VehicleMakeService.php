<?php

namespace App\Services;

use App\Models\VehicleMake;
use App\Repositories\VehicleMakeRepository;
use Illuminate\Database\Eloquent\Collection;

class VehicleMakeService
{
    public function __construct(
        private VehicleMakeRepository $vehicleMakeRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->vehicleMakeRepository->getAll();
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
