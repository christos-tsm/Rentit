<?php

namespace App\DTO\Requests;

class VehicleRequestDTO
{
    public function __construct(
        public readonly ?string $searchKey = null,
        public readonly ?int $makeId = null,
        public readonly int $rpp = 15,
        public readonly ?int $id = null,
    ) {}
}
