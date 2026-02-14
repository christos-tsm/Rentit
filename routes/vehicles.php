<?php

use App\Http\Controllers\VehicleController;
use App\Models\VehicleModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
    Route::get('/vehicles/create', [VehicleController::class, 'create'])->name('vehicles.create');
    Route::post('/vehicles', [VehicleController::class, 'store'])->name('vehicles.store');

    Route::get('/api/vehicle-models', function (Request $request): JsonResponse {
        $models = VehicleModel::query()
            ->where('vehicle_make_id', $request->integer('make_id'))
            ->orderBy('name')
            ->get(['id', 'name', 'vehicle_make_id']);

        return response()->json($models);
    })->name('api.vehicle-models');
});
