<?php

namespace App\Services;

use App\Models\YieldRule;
use App\Repositories\YieldRuleRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class YieldRuleService
{
    public function __construct(
        private YieldRuleRepository $yieldRuleRepository,
    ) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->yieldRuleRepository->getAll($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): YieldRule
    {
        return $this->yieldRuleRepository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(YieldRule $yieldRule, array $data): YieldRule
    {
        return $this->yieldRuleRepository->update($yieldRule, $data);
    }

    public function delete(YieldRule $yieldRule): void
    {
        $this->yieldRuleRepository->delete($yieldRule);
    }
}
