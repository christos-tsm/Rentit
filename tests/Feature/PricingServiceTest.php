<?php

use App\DTO\PricingRequestDTO;
use App\Models\BookingTimeAdjustment;
use App\Models\CategorySeasonPrice;
use App\Models\DriverAgeSurcharge;
use App\Models\DurationDiscount;
use App\Models\Extra;
use App\Models\Fee;
use App\Models\Location;
use App\Models\Season;
use App\Models\VehicleCategory;
use App\Services\PricingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makePricingDTO(array $overrides = []): PricingRequestDTO
{
    $defaults = [
        'vehicleCategoryId' => VehicleCategory::factory()->create(['base_price_per_day' => 50])->id,
        'pickupDate' => Carbon::parse('2026-07-01'),
        'returnDate' => Carbon::parse('2026-07-04'),
        'pickupLocationId' => Location::factory()->create(['type' => 'office'])->id,
        'returnLocationId' => Location::factory()->create(['type' => 'office'])->id,
        'driverAge' => null,
        'extras' => [],
        'bookingDate' => Carbon::parse('2026-06-01'),
    ];

    $merged = array_merge($defaults, $overrides);

    return new PricingRequestDTO(...$merged);
}

test('calculates base price from category default when no seasons', function () {
    $service = app(PricingService::class);
    $dto = makePricingDTO();

    $result = $service->calculate($dto);

    expect($result->baseTotal)->toBe(150.0) // 3 days x 50€
        ->and($result->totalDays)->toBe(3)
        ->and($result->grandTotal)->toBe(150.0);
});

test('uses season-specific pricing when season matches', function () {
    $category = VehicleCategory::factory()->create(['base_price_per_day' => 50]);

    $highSeason = Season::factory()->create([
        'name' => 'High Season',
        'start_date' => '2000-06-15',
        'end_date' => '2000-09-15',
        'is_recurring' => true,
        'priority' => 1,
        'is_active' => true,
    ]);

    CategorySeasonPrice::create([
        'vehicle_category_id' => $category->id,
        'season_id' => $highSeason->id,
        'daily_rate' => 80,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'vehicleCategoryId' => $category->id,
        'pickupDate' => Carbon::parse('2026-07-01'),
        'returnDate' => Carbon::parse('2026-07-04'),
    ]);

    $result = $service->calculate($dto);

    expect($result->baseTotal)->toBe(240.0); // 3 days x 80€
});

test('handles cross-season bookings correctly', function () {
    $category = VehicleCategory::factory()->create(['base_price_per_day' => 50]);

    $lowSeason = Season::factory()->create([
        'name' => 'Low Season',
        'start_date' => '2000-01-01',
        'end_date' => '2000-06-14',
        'is_recurring' => true,
        'priority' => 0,
        'is_active' => true,
    ]);

    $highSeason = Season::factory()->create([
        'name' => 'High Season',
        'start_date' => '2000-06-15',
        'end_date' => '2000-09-15',
        'is_recurring' => true,
        'priority' => 1,
        'is_active' => true,
    ]);

    CategorySeasonPrice::create([
        'vehicle_category_id' => $category->id,
        'season_id' => $lowSeason->id,
        'daily_rate' => 40,
    ]);

    CategorySeasonPrice::create([
        'vehicle_category_id' => $category->id,
        'season_id' => $highSeason->id,
        'daily_rate' => 80,
    ]);

    $service = app(PricingService::class);

    // 3 days in low season (Jun 12-14) + 3 days in high season (Jun 15-17)
    $dto = makePricingDTO([
        'vehicleCategoryId' => $category->id,
        'pickupDate' => Carbon::parse('2026-06-12'),
        'returnDate' => Carbon::parse('2026-06-18'),
    ]);

    $result = $service->calculate($dto);

    // Jun 12, 13, 14 = 3 x 40 = 120
    // Jun 15, 16, 17 = 3 x 80 = 240
    expect($result->baseTotal)->toBe(360.0)
        ->and($result->totalDays)->toBe(6);
});

test('per-year season overrides recurring season', function () {
    $category = VehicleCategory::factory()->create(['base_price_per_day' => 50]);

    $recurringHigh = Season::factory()->create([
        'name' => 'High Season',
        'start_date' => '2000-06-15',
        'end_date' => '2000-09-15',
        'is_recurring' => true,
        'priority' => 1,
        'is_active' => true,
    ]);

    $yearOverride = Season::factory()->create([
        'name' => 'Peak 2026',
        'start_date' => '2026-07-01',
        'end_date' => '2026-07-31',
        'is_recurring' => false,
        'priority' => 10,
        'is_active' => true,
    ]);

    CategorySeasonPrice::create([
        'vehicle_category_id' => $category->id,
        'season_id' => $recurringHigh->id,
        'daily_rate' => 80,
    ]);

    CategorySeasonPrice::create([
        'vehicle_category_id' => $category->id,
        'season_id' => $yearOverride->id,
        'daily_rate' => 120,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'vehicleCategoryId' => $category->id,
        'pickupDate' => Carbon::parse('2026-07-01'),
        'returnDate' => Carbon::parse('2026-07-04'),
    ]);

    $result = $service->calculate($dto);

    expect($result->baseTotal)->toBe(360.0); // 3 x 120€ (override wins)
});

test('applies duration discount correctly', function () {
    DurationDiscount::factory()->create([
        'name' => '8+ days',
        'min_days' => 8,
        'max_days' => null,
        'discount_percentage' => 20,
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'pickupDate' => Carbon::parse('2026-07-01'),
        'returnDate' => Carbon::parse('2026-07-11'), // 10 days
    ]);

    $result = $service->calculate($dto);

    expect($result->baseTotal)->toBe(500.0) // 10 x 50
        ->and($result->durationDiscount)->toBe(100.0) // 20% of 500
        ->and($result->grandTotal)->toBe(400.0);
});

test('applies early bird discount', function () {
    BookingTimeAdjustment::factory()->create([
        'name' => 'Early bird 3 months',
        'type' => 'early_bird',
        'min_days_before' => 90,
        'max_days_before' => null,
        'adjustment_type' => 'discount',
        'percentage' => 10,
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'pickupDate' => Carbon::parse('2026-07-01'),
        'returnDate' => Carbon::parse('2026-07-04'),
        'bookingDate' => Carbon::parse('2026-03-01'), // ~122 days before
    ]);

    $result = $service->calculate($dto);

    expect($result->baseTotal)->toBe(150.0)
        ->and($result->timeAdjustment)->toBe(-15.0) // -10% of 150
        ->and($result->grandTotal)->toBe(135.0);
});

test('applies last minute surcharge', function () {
    BookingTimeAdjustment::factory()->create([
        'name' => 'Last minute',
        'type' => 'last_minute',
        'min_days_before' => 0,
        'max_days_before' => 3,
        'adjustment_type' => 'surcharge',
        'percentage' => 15,
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'pickupDate' => Carbon::parse('2026-07-01'),
        'returnDate' => Carbon::parse('2026-07-04'),
        'bookingDate' => Carbon::parse('2026-06-29'), // 2 days before
    ]);

    $result = $service->calculate($dto);

    expect($result->timeAdjustment)->toBe(22.5) // +15% of 150
        ->and($result->grandTotal)->toBe(172.5);
});

test('applies driver age surcharge (fixed)', function () {
    DriverAgeSurcharge::factory()->create([
        'name' => 'Young driver',
        'min_age' => 18,
        'max_age' => 25,
        'surcharge_type' => 'fixed',
        'amount' => 30,
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO(['driverAge' => 22]);

    $result = $service->calculate($dto);

    expect($result->ageSurcharge)->toBe(30.0)
        ->and($result->grandTotal)->toBe(180.0);
});

test('applies driver age surcharge (percentage)', function () {
    DriverAgeSurcharge::factory()->create([
        'name' => 'Senior driver',
        'min_age' => 70,
        'max_age' => 100,
        'surcharge_type' => 'percentage',
        'amount' => 10,
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO(['driverAge' => 75]);

    $result = $service->calculate($dto);

    expect($result->ageSurcharge)->toBe(15.0); // 10% of 150
});

test('applies one-way fee when locations differ', function () {
    $pickupLoc = Location::factory()->create(['type' => 'office']);
    $returnLoc = Location::factory()->create(['type' => 'office']);

    Fee::factory()->create([
        'name' => 'One-way fee',
        'type' => 'fixed',
        'amount' => 50,
        'applies_to' => 'one_way',
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'pickupLocationId' => $pickupLoc->id,
        'returnLocationId' => $returnLoc->id,
    ]);

    $result = $service->calculate($dto);

    expect($result->feesTotal)->toBe(50.0)
        ->and($result->feeDetails)->toHaveKey('One-way fee');
});

test('does not apply one-way fee when same location', function () {
    $location = Location::factory()->create(['type' => 'office']);

    Fee::factory()->create([
        'name' => 'One-way fee',
        'type' => 'fixed',
        'amount' => 50,
        'applies_to' => 'one_way',
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'pickupLocationId' => $location->id,
        'returnLocationId' => $location->id,
    ]);

    $result = $service->calculate($dto);

    expect($result->feesTotal)->toBe(0.0);
});

test('applies airport pickup fee', function () {
    $airport = Location::factory()->airport()->create();
    $office = Location::factory()->create(['type' => 'office']);

    Fee::factory()->create([
        'name' => 'Airport pickup',
        'type' => 'fixed',
        'amount' => 25,
        'applies_to' => 'airport_pickup',
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'pickupLocationId' => $airport->id,
        'returnLocationId' => $office->id,
    ]);

    $result = $service->calculate($dto);

    expect($result->feesTotal)->toBe(25.0);
});

test('calculates extras per day', function () {
    $gps = Extra::factory()->create([
        'name' => 'GPS',
        'price_per_day' => 5,
        'type' => 'per_day',
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'extras' => [['extra_id' => $gps->id, 'quantity' => 1]],
    ]);

    $result = $service->calculate($dto);

    expect($result->extrasTotal)->toBe(15.0) // 3 days x 5€
        ->and($result->extraDetails)->toHaveKey('GPS');
});

test('calculates extras per rental', function () {
    $insurance = Extra::factory()->create([
        'name' => 'Full insurance',
        'price_per_day' => 50,
        'type' => 'per_rental',
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'extras' => [['extra_id' => $insurance->id, 'quantity' => 1]],
    ]);

    $result = $service->calculate($dto);

    expect($result->extrasTotal)->toBe(50.0); // flat rate, not per day
});

test('full pricing scenario with all adjustments', function () {
    $category = VehicleCategory::factory()->create(['base_price_per_day' => 50]);

    // Season: high season 80€/day
    $season = Season::factory()->create([
        'name' => 'High',
        'start_date' => '2000-06-01',
        'end_date' => '2000-09-30',
        'is_recurring' => true,
        'priority' => 1,
        'is_active' => true,
    ]);
    CategorySeasonPrice::create([
        'vehicle_category_id' => $category->id,
        'season_id' => $season->id,
        'daily_rate' => 80,
    ]);

    // Duration discount: 8+ days = 20%
    DurationDiscount::factory()->create([
        'min_days' => 8,
        'max_days' => null,
        'discount_percentage' => 20,
        'is_active' => true,
    ]);

    // Airport pickup fee: 25€
    $airport = Location::factory()->airport()->create();
    $office = Location::factory()->create(['type' => 'office']);
    Fee::factory()->create([
        'name' => 'Airport pickup',
        'type' => 'fixed',
        'amount' => 25,
        'applies_to' => 'airport_pickup',
        'is_active' => true,
    ]);

    // GPS extra: 5€/day
    $gps = Extra::factory()->create([
        'name' => 'GPS',
        'price_per_day' => 5,
        'type' => 'per_day',
        'is_active' => true,
    ]);

    $service = app(PricingService::class);
    $dto = makePricingDTO([
        'vehicleCategoryId' => $category->id,
        'pickupDate' => Carbon::parse('2026-07-01'),
        'returnDate' => Carbon::parse('2026-07-11'), // 10 days
        'pickupLocationId' => $airport->id,
        'returnLocationId' => $office->id,
        'extras' => [['extra_id' => $gps->id, 'quantity' => 1]],
    ]);

    $result = $service->calculate($dto);

    // Base: 10 x 80 = 800
    // Duration discount: -20% = -160
    // Airport fee: +25
    // GPS: 10 x 5 = +50
    // Total: 800 - 160 + 25 + 50 = 715
    expect($result->baseTotal)->toBe(800.0)
        ->and($result->durationDiscount)->toBe(160.0)
        ->and($result->feesTotal)->toBe(25.0)
        ->and($result->extrasTotal)->toBe(50.0)
        ->and($result->grandTotal)->toBe(715.0)
        ->and($result->totalDays)->toBe(10);
});

test('pricing breakdown toArray works correctly', function () {
    $service = app(PricingService::class);
    $dto = makePricingDTO();

    $result = $service->calculate($dto);
    $array = $result->toArray();

    expect($array)->toHaveKeys([
        'base_total',
        'duration_discount',
        'time_adjustment',
        'age_surcharge',
        'yield_adjustment',
        'fees_total',
        'extras_total',
        'grand_total',
        'total_days',
        'daily_rates',
        'applied_rules',
    ]);
});
