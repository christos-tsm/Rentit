<?php

namespace App\Repositories;

use App\Models\VehicleCategory;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleCategoryRepository {
    public function getAll(int $perPage = 15): LengthAwarePaginator {
        return VehicleCategory::query()
            ->withCount('vehicles')
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): VehicleCategory {
        return VehicleCategory::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(VehicleCategory $category, array $data): VehicleCategory {
        $category->update($data);

        return $category->refresh();
    }

    public function delete(VehicleCategory $category): void {
        $category->delete();
    }
}
