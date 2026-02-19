<?php

namespace App\Services;

use App\Models\Extra;
use App\Repositories\ExtraRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ExtraService
{
    public function __construct(
        private ExtraRepository $extraRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->extraRepository->getAll($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Extra
    {
        return $this->extraRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Extra $extra, array $data): Extra
    {
        return $this->extraRepository->update($extra, $data);
    }

    public function delete(Extra $extra): void
    {
        $this->extraRepository->delete($extra);
    }
}
