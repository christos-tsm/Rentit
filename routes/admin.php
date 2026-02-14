<?php

use App\Http\Controllers\VehicleCategoryController;
use App\Http\Controllers\VehicleMakeController;
use App\Http\Controllers\VehicleModelController;
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
});
