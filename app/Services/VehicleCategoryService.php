<?php

namespace App\Services;

use App\Models\VehicleCategory;
use App\Repositories\VehicleCategoryRepository;
use Illuminate\Database\Eloquent\Collection;

class VehicleCategoryService
{
    public function __construct(
        private VehicleCategoryRepository $vehicleCategoryRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->vehicleCategoryRepository->getAll();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): VehicleCategory
    {
        $data['slug'] = str($data['name'])->slug()->toString();

        return $this->vehicleCategoryRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(VehicleCategory $category, array $data): VehicleCategory
    {
        $data['slug'] = str($data['name'])->slug()->toString();

        return $this->vehicleCategoryRepository->update($category, $data);
    }

    public function delete(VehicleCategory $category): void
    {
        $this->vehicleCategoryRepository->delete($category);
    }
}
