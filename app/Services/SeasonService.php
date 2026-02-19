<?php

namespace App\Services;

use App\Models\Season;
use App\Repositories\SeasonRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class SeasonService
{
    public function __construct(
        private SeasonRepository $seasonRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->seasonRepository->getAll($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Season
    {
        return $this->seasonRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Season $season, array $data): Season
    {
        return $this->seasonRepository->update($season, $data);
    }

    public function delete(Season $season): void
    {
        $this->seasonRepository->delete($season);
    }
}
