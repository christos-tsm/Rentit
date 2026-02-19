<?php

namespace App\DTO;

use Carbon\Carbon;

class PricingRequestDTO
{
    /**
     * @param  array<int, array{extra_id: int, quantity: int}>  $extras
     */
    public function __construct(
        public readonly int $vehicleCategoryId,
        public readonly Carbon $pickupDate,
        public readonly Carbon $returnDate,
        public readonly int $pickupLocationId,
        public readonly int $returnLocationId,
        public readonly ?int $driverAge = null,
        public readonly array $extras = [],
        public readonly ?Carbon $bookingDate = null,
    ) {}
}
