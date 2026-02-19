<?php

namespace App\Repositories;

use App\Models\Booking;
use Illuminate\Pagination\LengthAwarePaginator;

class BookingRepository
{
    public function getAll(int $perPage = 15, ?string $status = null, ?int $customerId = null): LengthAwarePaginator
    {
        return Booking::query()
            ->with(['customer', 'vehicle.vehicleModel', 'vehicle.category', 'pickupLocation', 'returnLocation'])
            ->when($status, fn ($q, $s) => $q->where('status', $s))
            ->when($customerId, fn ($q, $id) => $q->where('customer_id', $id))
            ->orderByDesc('pickup_date')
            ->paginate($perPage);
    }

    public function find(int $id): Booking
    {
        return Booking::query()
            ->with(['customer', 'vehicle.vehicleModel', 'vehicle.category', 'pickupLocation', 'returnLocation', 'extras'])
            ->findOrFail($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Booking $booking, array $data): Booking
    {
        $booking->update($data);

        return $booking->refresh();
    }

    public function delete(Booking $booking): void
    {
        $booking->delete();
    }
}
