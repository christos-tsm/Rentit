<?php

namespace App\Repositories;

use App\Models\VehicleCategory;
use Illuminate\Database\Eloquent\Collection;

class VehicleCategoryRepository
{
    public function getAll(): Collection
    {
        return VehicleCategory::query()
            ->withCount('vehicles')
            ->orderBy('name')
            ->get();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): VehicleCategory
    {
        return VehicleCategory::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(VehicleCategory $category, array $data): VehicleCategory
    {
        $category->update($data);

        return $category->refresh();
    }

    public function delete(VehicleCategory $category): void
    {
        $category->delete();
    }
}
