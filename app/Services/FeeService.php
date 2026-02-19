<?php

namespace App\Services;

use App\Models\Fee;
use App\Repositories\FeeRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class FeeService
{
    public function __construct(
        private FeeRepository $feeRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->feeRepository->getAll($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Fee
    {
        return $this->feeRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Fee $fee, array $data): Fee
    {
        return $this->feeRepository->update($fee, $data);
    }

    public function delete(Fee $fee): void
    {
        $this->feeRepository->delete($fee);
    }
}
