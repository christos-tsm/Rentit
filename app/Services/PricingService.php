<?php

namespace App\Services;

use App\DTO\PricingBreakdown;
use App\DTO\PricingRequestDTO;
use App\Models\BookingTimeAdjustment;
use App\Models\CategorySeasonPrice;
use App\Models\DriverAgeSurcharge;
use App\Models\DurationDiscount;
use App\Models\Extra;
use App\Models\Fee;
use App\Models\Location;
use App\Models\Season;
use App\Models\Vehicle;
use App\Models\VehicleCategory;
use App\Models\YieldRule;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class PricingService
{
    public function calculate(PricingRequestDTO $dto): PricingBreakdown
    {
        $totalDays = (int) $dto->pickupDate->diffInDays($dto->returnDate);

        if ($totalDays < 1) {
            $totalDays = 1;
        }

        $bookingDate = $dto->bookingDate ?? Carbon::now();
        $appliedRules = [];

        // 1. Calculate daily rates per day
        $dailyRates = $this->calculateDailyRates($dto->vehicleCategoryId, $dto->pickupDate, $dto->returnDate);
        $baseTotal = array_sum($dailyRates);
        $appliedRules[] = "Βασική τιμή: {$totalDays} ημέρες";

        // 2. Duration discount
        $durationDiscount = $this->applyDurationDiscount($baseTotal, $totalDays, $appliedRules);

        // 3. Early bird / Last minute adjustment
        $timeAdjustment = $this->applyTimeAdjustment($baseTotal, $bookingDate, $dto->pickupDate, $appliedRules);

        // 4. Driver age surcharge
        $ageSurcharge = $this->applyAgeSurcharge($baseTotal, $dto->driverAge, $appliedRules);

        // 5. Yield management
        $yieldAdjustment = $this->applyYieldAdjustment(
            $baseTotal,
            $dto->vehicleCategoryId,
            $dto->pickupDate,
            $dto->returnDate,
            $appliedRules,
        );

        // 6. Fees
        [$feesTotal, $feeDetails] = $this->calculateFees(
            $totalDays,
            $dto->pickupLocationId,
            $dto->returnLocationId,
            $appliedRules,
        );

        // 7. Extras
        [$extrasTotal, $extraDetails] = $this->calculateExtras($dto->extras, $totalDays, $appliedRules);

        $grandTotal = $baseTotal - $durationDiscount + $timeAdjustment + $ageSurcharge + $yieldAdjustment + $feesTotal + $extrasTotal;
        $grandTotal = max(0, round($grandTotal, 2));

        return new PricingBreakdown(
            baseTotal: round($baseTotal, 2),
            durationDiscount: round($durationDiscount, 2),
            timeAdjustment: round($timeAdjustment, 2),
            ageSurcharge: round($ageSurcharge, 2),
            yieldAdjustment: round($yieldAdjustment, 2),
            feesTotal: round($feesTotal, 2),
            extrasTotal: round($extrasTotal, 2),
            grandTotal: $grandTotal,
            totalDays: $totalDays,
            dailyRates: $dailyRates,
            appliedRules: $appliedRules,
            feeDetails: $feeDetails,
            extraDetails: $extraDetails,
        );
    }

    /**
     * @return array<string, float>
     */
    private function calculateDailyRates(int $categoryId, Carbon $pickupDate, Carbon $returnDate): array
    {
        $category = VehicleCategory::findOrFail($categoryId);
        $seasons = Season::query()->where('is_active', true)->get();
        $seasonPrices = CategorySeasonPrice::query()
            ->where('vehicle_category_id', $categoryId)
            ->get()
            ->keyBy('season_id');

        $rates = [];
        $period = CarbonPeriod::create($pickupDate, $returnDate->copy()->subDay());

        foreach ($period as $day) {
            $rate = $this->getDailyRateForDate($day, $category, $seasons, $seasonPrices);
            $rates[$day->format('Y-m-d')] = $rate;
        }

        return $rates;
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Collection<int, Season>  $seasons
     * @param  \Illuminate\Database\Eloquent\Collection<int, CategorySeasonPrice>  $seasonPrices
     */
    private function getDailyRateForDate(
        Carbon $date,
        VehicleCategory $category,
        $seasons,
        $seasonPrices,
    ): float {
        $matchedSeason = null;
        $highestPriority = -1;

        foreach ($seasons as $season) {
            if (! $this->dateMatchesSeason($date, $season)) {
                continue;
            }

            if ($season->priority > $highestPriority) {
                $highestPriority = $season->priority;
                $matchedSeason = $season;
            }
        }

        if ($matchedSeason && $seasonPrices->has($matchedSeason->id)) {
            return (float) $seasonPrices->get($matchedSeason->id)->daily_rate;
        }

        return (float) $category->base_price_per_day;
    }

    private function dateMatchesSeason(Carbon $date, Season $season): bool
    {
        if ($season->is_recurring) {
            $month = $date->month;
            $day = $date->day;
            $startMonth = $season->start_date->month;
            $startDay = $season->start_date->day;
            $endMonth = $season->end_date->month;
            $endDay = $season->end_date->day;

            $dateValue = $month * 100 + $day;
            $startValue = $startMonth * 100 + $startDay;
            $endValue = $endMonth * 100 + $endDay;

            if ($startValue <= $endValue) {
                return $dateValue >= $startValue && $dateValue <= $endValue;
            }

            // Wraps around year boundary (e.g., Nov-Feb)
            return $dateValue >= $startValue || $dateValue <= $endValue;
        }

        return $date->between($season->start_date, $season->end_date);
    }

    /**
     * @param  array<string>  $appliedRules
     */
    private function applyDurationDiscount(float $baseTotal, int $totalDays, array &$appliedRules): float
    {
        $discount = DurationDiscount::query()
            ->where('is_active', true)
            ->where('min_days', '<=', $totalDays)
            ->where(function ($q) use ($totalDays) {
                $q->whereNull('max_days')
                    ->orWhere('max_days', '>=', $totalDays);
            })
            ->orderByDesc('discount_percentage')
            ->first();

        if (! $discount || $discount->discount_percentage <= 0) {
            return 0;
        }

        $amount = $baseTotal * ($discount->discount_percentage / 100);
        $appliedRules[] = "Έκπτωση διάρκειας ({$discount->name}): -{$discount->discount_percentage}%";

        return $amount;
    }

    /**
     * @param  array<string>  $appliedRules
     */
    private function applyTimeAdjustment(float $baseTotal, Carbon $bookingDate, Carbon $pickupDate, array &$appliedRules): float
    {
        $daysBefore = (int) $bookingDate->diffInDays($pickupDate, false);

        if ($daysBefore < 0) {
            $daysBefore = 0;
        }

        $adjustment = BookingTimeAdjustment::query()
            ->where('is_active', true)
            ->where('min_days_before', '<=', $daysBefore)
            ->where(function ($q) use ($daysBefore) {
                $q->whereNull('max_days_before')
                    ->orWhere('max_days_before', '>=', $daysBefore);
            })
            ->first();

        if (! $adjustment) {
            return 0;
        }

        $amount = $baseTotal * ($adjustment->percentage / 100);

        if ($adjustment->adjustment_type === 'discount') {
            $appliedRules[] = "Early bird ({$adjustment->name}): -{$adjustment->percentage}%";

            return -$amount;
        }

        $appliedRules[] = "Last minute ({$adjustment->name}): +{$adjustment->percentage}%";

        return $amount;
    }

    /**
     * @param  array<string>  $appliedRules
     */
    private function applyAgeSurcharge(float $baseTotal, ?int $driverAge, array &$appliedRules): float
    {
        if ($driverAge === null) {
            return 0;
        }

        $surcharge = DriverAgeSurcharge::query()
            ->where('is_active', true)
            ->where('min_age', '<=', $driverAge)
            ->where('max_age', '>=', $driverAge)
            ->first();

        if (! $surcharge) {
            return 0;
        }

        if ($surcharge->surcharge_type === 'fixed') {
            $appliedRules[] = "Χρέωση ηλικίας ({$surcharge->name}): +{$surcharge->amount}€";

            return (float) $surcharge->amount;
        }

        $amount = $baseTotal * ($surcharge->amount / 100);
        $appliedRules[] = "Χρέωση ηλικίας ({$surcharge->name}): +{$surcharge->amount}%";

        return $amount;
    }

    /**
     * @param  array<string>  $appliedRules
     */
    private function applyYieldAdjustment(float $baseTotal, int $categoryId, Carbon $pickupDate, Carbon $returnDate, array &$appliedRules): float
    {
        $bookedVehicleIds = Vehicle::query()
            ->where('vehicle_category_id', $categoryId)
            ->whereHas('bookings', function ($q) use ($pickupDate, $returnDate) {
                $q->whereIn('status', ['confirmed', 'active'])
                    ->where('pickup_date', '<', $returnDate)
                    ->where('return_date', '>', $pickupDate);
            })
            ->pluck('id');

        $totalVehicles = Vehicle::query()
            ->where('vehicle_category_id', $categoryId)
            ->where('status', '!=', 'out_of_service')
            ->count();

        $availableCount = $totalVehicles - $bookedVehicleIds->count();

        $rule = YieldRule::query()
            ->where('is_active', true)
            ->where('min_available_vehicles', '>=', $availableCount)
            ->orderBy('min_available_vehicles')
            ->first();

        if (! $rule) {
            return 0;
        }

        $amount = $baseTotal * ($rule->price_increase_percentage / 100);
        $appliedRules[] = "Yield management (+{$rule->price_increase_percentage}%): {$availableCount} διαθέσιμα";

        return $amount;
    }

    /**
     * @param  array<string>  $appliedRules
     * @return array{0: float, 1: array<string, float>}
     */
    private function calculateFees(int $totalDays, int $pickupLocationId, int $returnLocationId, array &$appliedRules): array
    {
        $feesTotal = 0;
        $feeDetails = [];

        $pickupLocation = Location::find($pickupLocationId);
        $returnLocation = Location::find($returnLocationId);

        $fees = Fee::query()->where('is_active', true)->get();

        foreach ($fees as $fee) {
            $applies = match ($fee->applies_to) {
                'all' => true,
                'one_way' => $pickupLocationId !== $returnLocationId,
                'airport_pickup' => $pickupLocation?->type === 'airport',
                'airport_return' => $returnLocation?->type === 'airport',
                default => false,
            };

            if (! $applies) {
                continue;
            }

            $amount = $fee->type === 'per_day'
                ? (float) $fee->amount * $totalDays
                : (float) $fee->amount;

            $feesTotal += $amount;
            $feeDetails[$fee->name] = $amount;
            $appliedRules[] = "Τέλος ({$fee->name}): +{$amount}€";
        }

        return [$feesTotal, $feeDetails];
    }

    /**
     * @param  array<int, array{extra_id: int, quantity: int}>  $extras
     * @param  array<string>  $appliedRules
     * @return array{0: float, 1: array<string, float>}
     */
    private function calculateExtras(array $extras, int $totalDays, array &$appliedRules): array
    {
        $extrasTotal = 0;
        $extraDetails = [];

        if (empty($extras)) {
            return [0, []];
        }

        $extraIds = array_column($extras, 'extra_id');
        $extraModels = Extra::query()
            ->whereIn('id', $extraIds)
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        foreach ($extras as $item) {
            $extra = $extraModels->get($item['extra_id']);
            if (! $extra) {
                continue;
            }

            $quantity = $item['quantity'] ?? 1;

            $amount = $extra->type === 'per_day'
                ? (float) $extra->price_per_day * $totalDays * $quantity
                : (float) $extra->price_per_day * $quantity;

            $extrasTotal += $amount;
            $extraDetails[$extra->name] = $amount;
            $appliedRules[] = "Extra ({$extra->name} x{$quantity}): +{$amount}€";
        }

        return [$extrasTotal, $extraDetails];
    }
}
