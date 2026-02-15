<?php

namespace App\Services;

use App\Models\VehicleCategory;
use App\Repositories\VehicleCategoryRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleCategoryService
{
    public function __construct(
        private VehicleCategoryRepository $vehicleCategoryRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->vehicleCategoryRepository->getAll($perPage);
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
