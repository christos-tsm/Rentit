<?php

namespace App\Repositories;

use App\Models\Fee;
use Illuminate\Pagination\LengthAwarePaginator;

class FeeRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Fee::query()
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Fee
    {
        return Fee::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Fee $fee, array $data): Fee
    {
        $fee->update($data);

        return $fee->refresh();
    }

    public function delete(Fee $fee): void
    {
        $fee->delete();
    }
}
