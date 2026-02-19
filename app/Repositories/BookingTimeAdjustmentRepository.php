<?php

namespace App\Repositories;

use App\Models\BookingTimeAdjustment;
use Illuminate\Pagination\LengthAwarePaginator;

class BookingTimeAdjustmentRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return BookingTimeAdjustment::query()
            ->orderBy('type')
            ->orderBy('min_days_before')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): BookingTimeAdjustment
    {
        return BookingTimeAdjustment::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(BookingTimeAdjustment $bookingTimeAdjustment, array $data): BookingTimeAdjustment
    {
        $bookingTimeAdjustment->update($data);

        return $bookingTimeAdjustment->refresh();
    }

    public function delete(BookingTimeAdjustment $bookingTimeAdjustment): void
    {
        $bookingTimeAdjustment->delete();
    }
}
