<?php

namespace App\Repositories;

use App\Models\YieldRule;
use Illuminate\Pagination\LengthAwarePaginator;

class YieldRuleRepository
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return YieldRule::query()
            ->orderBy('min_available_vehicles')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): YieldRule
    {
        return YieldRule::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(YieldRule $yieldRule, array $data): YieldRule
    {
        $yieldRule->update($data);

        return $yieldRule->refresh();
    }

    public function delete(YieldRule $yieldRule): void
    {
        $yieldRule->delete();
    }
}
