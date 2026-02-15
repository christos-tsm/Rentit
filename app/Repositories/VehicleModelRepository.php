<?php

namespace App\Repositories;

use App\Models\VehicleModel;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleModelRepository {
    public function getAll(?int $vehicleMakeId = null, int $perPage = 15): LengthAwarePaginator {
        return VehicleModel::query()
            ->with('make')
            ->withCount('vehicles')
            ->when($vehicleMakeId, fn($query) => $query->where('vehicle_make_id', $vehicleMakeId))
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function create(int $vehicleMakeId, string $name): VehicleModel {
        return VehicleModel::create([
            'vehicle_make_id' => $vehicleMakeId,
            'name' => $name,
        ]);
    }

    public function update(VehicleModel $vehicleModel, int $vehicleMakeId, string $name): VehicleModel {
        $vehicleModel->update([
            'vehicle_make_id' => $vehicleMakeId,
            'name' => $name,
        ]);

        return $vehicleModel->refresh();
    }

    public function delete(VehicleModel $vehicleModel): void {
        $vehicleModel->delete();
    }
}
