<?php

namespace App\Http\Controllers;

use App\DTO\PricingRequestDTO;
use App\Http\Requests\PriceCalculationRequest;
use App\Services\PricingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class PriceCalculationController extends Controller
{
    public function __construct(
        protected PricingService $pricingService,
    ) {}

    public function __invoke(PriceCalculationRequest $request): JsonResponse
    {
        $data = $request->validated();

        $dto = new PricingRequestDTO(
            vehicleCategoryId: $data['vehicle_category_id'],
            pickupDate: Carbon::parse($data['pickup_date']),
            returnDate: Carbon::parse($data['return_date']),
            pickupLocationId: $data['pickup_location_id'],
            returnLocationId: $data['return_location_id'],
            driverAge: $data['driver_age'] ?? null,
            extras: $data['extras'] ?? [],
            bookingDate: Carbon::now(),
        );

        $breakdown = $this->pricingService->calculate($dto);

        return response()->json($breakdown->toArray());
    }
}
