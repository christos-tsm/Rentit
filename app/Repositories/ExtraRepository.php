<?php

namespace App\Repositories;

use App\Models\Extra;
use Illuminate\Pagination\LengthAwarePaginator;

class ExtraRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Extra::query()
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Extra
    {
        return Extra::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Extra $extra, array $data): Extra
    {
        $extra->update($data);

        return $extra->refresh();
    }

    public function delete(Extra $extra): void
    {
        $extra->delete();
    }
}
