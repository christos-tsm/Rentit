<?php

namespace App\Repositories;

use App\Models\VehicleMake;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleMakeRepository {
    public function getAll(int $perPage = 15): LengthAwarePaginator {
        return VehicleMake::query()
            ->withCount('vehicleModels')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function getForSelect(): Collection {
        return VehicleMake::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function create(string $name): VehicleMake {
        return VehicleMake::create(['name' => $name]);
    }

    public function update(VehicleMake $vehicleMake, string $name): VehicleMake {
        $vehicleMake->update(['name' => $name]);

        return $vehicleMake->refresh();
    }

    public function delete(VehicleMake $vehicleMake): void {
        $vehicleMake->delete();
    }
}
