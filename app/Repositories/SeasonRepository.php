<?php

namespace App\Repositories;

use App\Models\Season;
use Illuminate\Pagination\LengthAwarePaginator;

class SeasonRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Season::query()
            ->with('categoryPrices')
            ->orderBy('priority', 'desc')
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Season
    {
        return Season::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Season $season, array $data): Season
    {
        $season->update($data);

        return $season->refresh();
    }

    public function delete(Season $season): void
    {
        $season->delete();
    }
}
