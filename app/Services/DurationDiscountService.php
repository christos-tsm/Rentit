<?php

namespace App\Services;

use App\Models\DurationDiscount;
use App\Repositories\DurationDiscountRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class DurationDiscountService
{
    public function __construct(
        private DurationDiscountRepository $durationDiscountRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->durationDiscountRepository->getAll($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): DurationDiscount
    {
        return $this->durationDiscountRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(DurationDiscount $durationDiscount, array $data): DurationDiscount
    {
        return $this->durationDiscountRepository->update($durationDiscount, $data);
    }

    public function delete(DurationDiscount $durationDiscount): void
    {
        $this->durationDiscountRepository->delete($durationDiscount);
    }
}
