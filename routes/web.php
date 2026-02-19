<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('guide', function () {
    return Inertia::render('guide');
})->middleware(['auth', 'verified'])->name('guide');

require __DIR__.'/vehicles.php';
require __DIR__.'/bookings.php';
require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
