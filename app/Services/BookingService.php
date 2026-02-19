<?php

namespace App\Services;

use App\DTO\PricingRequestDTO;
use App\Models\Booking;
use App\Repositories\BookingRepository;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;

class BookingService
{
    public function __construct(
        private BookingRepository $bookingRepository,
        private PricingService $pricingService,
    ) {}

    public function getAll(int $perPage = 15, ?string $status = null, ?int $customerId = null): LengthAwarePaginator
    {
        return $this->bookingRepository->getAll($perPage, $status, $customerId);
    }

    public function find(int $id): Booking
    {
        return $this->bookingRepository->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Booking
    {
        $pricingDto = new PricingRequestDTO(
            vehicleCategoryId: $data['vehicle_category_id'],
            pickupDate: Carbon::parse($data['pickup_date']),
            returnDate: Carbon::parse($data['return_date']),
            pickupLocationId: $data['pickup_location_id'],
            returnLocationId: $data['return_location_id'],
            driverAge: $data['driver_age'] ?? null,
            extras: $data['extras'] ?? [],
            bookingDate: Carbon::now(),
        );

        $breakdown = $this->pricingService->calculate($pricingDto);

        $booking = $this->bookingRepository->create([
            'customer_id' => $data['customer_id'],
            'vehicle_id' => $data['vehicle_id'],
            'pickup_location_id' => $data['pickup_location_id'],
            'return_location_id' => $data['return_location_id'],
            'pickup_date' => $data['pickup_date'],
            'return_date' => $data['return_date'],
            'total_price' => $breakdown->grandTotal,
            'status' => $data['status'] ?? 'pending',
            'driver_age' => $data['driver_age'] ?? null,
            'notes' => $data['notes'] ?? null,
            'price_breakdown' => $breakdown->toArray(),
        ]);

        if (! empty($data['extras'])) {
            $extrasSync = [];
            foreach ($data['extras'] as $extra) {
                $extrasSync[$extra['extra_id']] = ['quantity' => $extra['quantity'] ?? 1];
            }
            $booking->extras()->sync($extrasSync);
        }

        return $booking;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Booking $booking, array $data): Booking
    {
        return $this->bookingRepository->update($booking, $data);
    }

    public function delete(Booking $booking): void
    {
        $this->bookingRepository->delete($booking);
    }
}
