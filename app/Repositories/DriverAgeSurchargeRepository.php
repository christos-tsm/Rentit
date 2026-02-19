<?php

namespace App\Repositories;

use App\Models\DriverAgeSurcharge;
use Illuminate\Pagination\LengthAwarePaginator;

class DriverAgeSurchargeRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return DriverAgeSurcharge::query()
            ->orderBy('min_age')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): DriverAgeSurcharge
    {
        return DriverAgeSurcharge::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(DriverAgeSurcharge $driverAgeSurcharge, array $data): DriverAgeSurcharge
    {
        $driverAgeSurcharge->update($data);

        return $driverAgeSurcharge->refresh();
    }

    public function delete(DriverAgeSurcharge $driverAgeSurcharge): void
    {
        $driverAgeSurcharge->delete();
    }
}
