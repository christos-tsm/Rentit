<?php

namespace App\Repositories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class LocationRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Location::query()
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function getForSelect(): Collection
    {
        return Location::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'type']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Location
    {
        return Location::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Location $location, array $data): Location
    {
        $location->update($data);

        return $location->refresh();
    }

    public function delete(Location $location): void
    {
        $location->delete();
    }
}
