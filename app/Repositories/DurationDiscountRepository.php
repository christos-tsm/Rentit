<?php

namespace App\Repositories;

use App\Models\DurationDiscount;
use Illuminate\Pagination\LengthAwarePaginator;

class DurationDiscountRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return DurationDiscount::query()
            ->orderBy('min_days')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): DurationDiscount
    {
        return DurationDiscount::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(DurationDiscount $durationDiscount, array $data): DurationDiscount
    {
        $durationDiscount->update($data);

        return $durationDiscount->refresh();
    }

    public function delete(DurationDiscount $durationDiscount): void
    {
        $durationDiscount->delete();
    }
}
