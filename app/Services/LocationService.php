<?php

namespace App\Services;

use App\Models\Location;
use App\Repositories\LocationRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class LocationService
{
    public function __construct(
        private LocationRepository $locationRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->locationRepository->getAll($perPage);
    }

    public function getForSelect(): Collection
    {
        return $this->locationRepository->getForSelect();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Location
    {
        return $this->locationRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Location $location, array $data): Location
    {
        return $this->locationRepository->update($location, $data);
    }

    public function delete(Location $location): void
    {
        $this->locationRepository->delete($location);
    }
}
