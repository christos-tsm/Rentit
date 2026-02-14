<?php

namespace App\Repositories;

use App\Models\VehicleMake;
use Illuminate\Database\Eloquent\Collection;

class VehicleMakeRepository
{
    public function getAll(): Collection
    {
        return VehicleMake::query()
            ->withCount('vehicleModels')
            ->orderBy('name')
            ->get();
    }

    public function create(string $name): VehicleMake
    {
        return VehicleMake::create(['name' => $name]);
    }

    public function update(VehicleMake $vehicleMake, string $name): VehicleMake
    {
        $vehicleMake->update(['name' => $name]);

        return $vehicleMake->refresh();
    }

    public function delete(VehicleMake $vehicleMake): void
    {
        $vehicleMake->delete();
    }
}
