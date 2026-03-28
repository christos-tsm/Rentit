<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('guide', function () {
    return Inertia::render('guide');
})->middleware(['auth', 'verified'])->name('guide');

require __DIR__ . '/vehicles.php';
require __DIR__ . '/bookings.php';
require __DIR__ . '/management.php';
require __DIR__ . '/settings.php';
