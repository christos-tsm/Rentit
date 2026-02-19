<?php

namespace App\Services;

use App\Models\DriverAgeSurcharge;
use App\Repositories\DriverAgeSurchargeRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class DriverAgeSurchargeService
{
    public function __construct(
        private DriverAgeSurchargeRepository $driverAgeSurchargeRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->driverAgeSurchargeRepository->getAll($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): DriverAgeSurcharge
    {
        return $this->driverAgeSurchargeRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(DriverAgeSurcharge $driverAgeSurcharge, array $data): DriverAgeSurcharge
    {
        return $this->driverAgeSurchargeRepository->update($driverAgeSurcharge, $data);
    }

    public function delete(DriverAgeSurcharge $driverAgeSurcharge): void
    {
        $this->driverAgeSurchargeRepository->delete($driverAgeSurcharge);
    }
}
