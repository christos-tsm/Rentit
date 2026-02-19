<?php

namespace App\Services;

use App\Models\BookingTimeAdjustment;
use App\Repositories\BookingTimeAdjustmentRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class BookingTimeAdjustmentService
{
    public function __construct(
        private BookingTimeAdjustmentRepository $bookingTimeAdjustmentRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->bookingTimeAdjustmentRepository->getAll($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): BookingTimeAdjustment
    {
        return $this->bookingTimeAdjustmentRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(BookingTimeAdjustment $bookingTimeAdjustment, array $data): BookingTimeAdjustment
    {
        return $this->bookingTimeAdjustmentRepository->update($bookingTimeAdjustment, $data);
    }

    public function delete(BookingTimeAdjustment $bookingTimeAdjustment): void
    {
        $this->bookingTimeAdjustmentRepository->delete($bookingTimeAdjustment);
    }
}
