<?php

use App\Http\Controllers\BookingTimeAdjustmentController;
use App\Http\Controllers\CategorySeasonPriceController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DriverAgeSurchargeController;
use App\Http\Controllers\DurationDiscountController;
use App\Http\Controllers\ExtraController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\VehicleCategoryController;
use App\Http\Controllers\VehicleMakeController;
use App\Http\Controllers\VehicleModelController;
use App\Http\Controllers\YieldRuleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/makes', [VehicleMakeController::class, 'index'])->name('admin.makes.index');
    Route::post('/makes', [VehicleMakeController::class, 'store'])->name('admin.makes.store');
    Route::put('/makes/{make}', [VehicleMakeController::class, 'update'])->name('admin.makes.update');
    Route::delete('/makes/{make}', [VehicleMakeController::class, 'destroy'])->name('admin.makes.destroy');

    Route::get('/models', [VehicleModelController::class, 'index'])->name('admin.models.index');
    Route::post('/models', [VehicleModelController::class, 'store'])->name('admin.models.store');
    Route::put('/models/{vehicleModel}', [VehicleModelController::class, 'update'])->name('admin.models.update');
    Route::delete('/models/{vehicleModel}', [VehicleModelController::class, 'destroy'])->name('admin.models.destroy');

    Route::get('/categories', [VehicleCategoryController::class, 'index'])->name('admin.categories.index');
    Route::post('/categories', [VehicleCategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/categories/{category}', [VehicleCategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/categories/{category}', [VehicleCategoryController::class, 'destroy'])->name('admin.categories.destroy');

    Route::get('/locations', [LocationController::class, 'index'])->name('admin.locations.index');
    Route::post('/locations', [LocationController::class, 'store'])->name('admin.locations.store');
    Route::put('/locations/{location}', [LocationController::class, 'update'])->name('admin.locations.update');
    Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->name('admin.locations.destroy');

    Route::get('/pricing/duration-discounts', [DurationDiscountController::class, 'index'])->name('admin.pricing.duration-discounts.index');
    Route::post('/pricing/duration-discounts', [DurationDiscountController::class, 'store'])->name('admin.pricing.duration-discounts.store');
    Route::put('/pricing/duration-discounts/{durationDiscount}', [DurationDiscountController::class, 'update'])->name('admin.pricing.duration-discounts.update');
    Route::delete('/pricing/duration-discounts/{durationDiscount}', [DurationDiscountController::class, 'destroy'])->name('admin.pricing.duration-discounts.destroy');

    Route::get('/pricing/time-adjustments', [BookingTimeAdjustmentController::class, 'index'])->name('admin.pricing.time-adjustments.index');
    Route::post('/pricing/time-adjustments', [BookingTimeAdjustmentController::class, 'store'])->name('admin.pricing.time-adjustments.store');
    Route::put('/pricing/time-adjustments/{timeAdjustment}', [BookingTimeAdjustmentController::class, 'update'])->name('admin.pricing.time-adjustments.update');
    Route::delete('/pricing/time-adjustments/{timeAdjustment}', [BookingTimeAdjustmentController::class, 'destroy'])->name('admin.pricing.time-adjustments.destroy');

    Route::get('/pricing/age-surcharges', [DriverAgeSurchargeController::class, 'index'])->name('admin.pricing.age-surcharges.index');
    Route::post('/pricing/age-surcharges', [DriverAgeSurchargeController::class, 'store'])->name('admin.pricing.age-surcharges.store');
    Route::put('/pricing/age-surcharges/{ageSurcharge}', [DriverAgeSurchargeController::class, 'update'])->name('admin.pricing.age-surcharges.update');
    Route::delete('/pricing/age-surcharges/{ageSurcharge}', [DriverAgeSurchargeController::class, 'destroy'])->name('admin.pricing.age-surcharges.destroy');

    Route::get('/pricing/fees', [FeeController::class, 'index'])->name('admin.pricing.fees.index');
    Route::post('/pricing/fees', [FeeController::class, 'store'])->name('admin.pricing.fees.store');
    Route::put('/pricing/fees/{fee}', [FeeController::class, 'update'])->name('admin.pricing.fees.update');
    Route::delete('/pricing/fees/{fee}', [FeeController::class, 'destroy'])->name('admin.pricing.fees.destroy');

    Route::get('/pricing/yield-rules', [YieldRuleController::class, 'index'])->name('admin.pricing.yield-rules.index');
    Route::post('/pricing/yield-rules', [YieldRuleController::class, 'store'])->name('admin.pricing.yield-rules.store');
    Route::put('/pricing/yield-rules/{yieldRule}', [YieldRuleController::class, 'update'])->name('admin.pricing.yield-rules.update');
    Route::delete('/pricing/yield-rules/{yieldRule}', [YieldRuleController::class, 'destroy'])->name('admin.pricing.yield-rules.destroy');

    Route::get('/seasons', [SeasonController::class, 'index'])->name('admin.seasons.index');
    Route::post('/seasons', [SeasonController::class, 'store'])->name('admin.seasons.store');
    Route::put('/seasons/{season}', [SeasonController::class, 'update'])->name('admin.seasons.update');
    Route::delete('/seasons/{season}', [SeasonController::class, 'destroy'])->name('admin.seasons.destroy');
    Route::post('/seasons/prices', [CategorySeasonPriceController::class, 'store'])->name('admin.seasons.prices.store');
    Route::put('/seasons/prices/{categorySeasonPrice}', [CategorySeasonPriceController::class, 'update'])->name('admin.seasons.prices.update');

    Route::get('/extras', [ExtraController::class, 'index'])->name('admin.extras.index');
    Route::post('/extras', [ExtraController::class, 'store'])->name('admin.extras.store');
    Route::put('/extras/{extra}', [ExtraController::class, 'update'])->name('admin.extras.update');
    Route::delete('/extras/{extra}', [ExtraController::class, 'destroy'])->name('admin.extras.destroy');

    Route::get('/customers', [CustomerController::class, 'index'])->name('admin.customers.index');
    Route::post('/customers', [CustomerController::class, 'store'])->name('admin.customers.store');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('admin.customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('admin.customers.destroy');
});
