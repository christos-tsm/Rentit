<?php

namespace App\DTO;

class PricingBreakdown
{
    /**
     * @param  array<string, float>  $dailyRates
     * @param  array<string>  $appliedRules
     * @param  array<string, float>  $feeDetails
     * @param  array<string, float>  $extraDetails
     */
    public function __construct(
        public readonly float $baseTotal,
        public readonly float $durationDiscount,
        public readonly float $timeAdjustment,
        public readonly float $ageSurcharge,
        public readonly float $yieldAdjustment,
        public readonly float $feesTotal,
        public readonly float $extrasTotal,
        public readonly float $grandTotal,
        public readonly int $totalDays,
        public readonly array $dailyRates = [],
        public readonly array $appliedRules = [],
        public readonly array $feeDetails = [],
        public readonly array $extraDetails = [],
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'base_total' => $this->baseTotal,
            'duration_discount' => $this->durationDiscount,
            'time_adjustment' => $this->timeAdjustment,
            'age_surcharge' => $this->ageSurcharge,
            'yield_adjustment' => $this->yieldAdjustment,
            'fees_total' => $this->feesTotal,
            'extras_total' => $this->extrasTotal,
            'grand_total' => $this->grandTotal,
            'total_days' => $this->totalDays,
            'daily_rates' => $this->dailyRates,
            'applied_rules' => $this->appliedRules,
            'fee_details' => $this->feeDetails,
            'extra_details' => $this->extraDetails,
        ];
    }
}
