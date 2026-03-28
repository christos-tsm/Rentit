<?php

use App\Models\Booking;
use App\Models\Maintenance;
use App\Models\User;
use App\Models\Vehicle;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard returns all required props', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('calendarBookings')
            ->has('revenueByMonth')
            ->has('vehicleStatusCounts')
            ->has('recentBookings')
            ->has('maintenanceVehicles')
        );
});

test('dashboard returns calendar bookings within the visible window', function () {
    $user = User::factory()->create();

    // Within window: current month
    Booking::factory()->create([
        'pickup_date' => now()->startOfMonth(),
        'return_date' => now()->endOfMonth(),
        'status' => 'confirmed',
    ]);

    // Within window: 6 months ahead
    Booking::factory()->create([
        'pickup_date' => now()->addMonths(6),
        'return_date' => now()->addMonths(6)->addDays(5),
        'status' => 'active',
    ]);

    // Outside window: 3 months in the past
    Booking::factory()->create([
        'pickup_date' => now()->subMonths(3),
        'return_date' => now()->subMonths(2),
        'status' => 'completed',
    ]);

    // Within window but cancelled — excluded
    Booking::factory()->create([
        'pickup_date' => now(),
        'return_date' => now()->addDays(5),
        'status' => 'cancelled',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('calendarBookings', 2)
        );
});

test('dashboard returns revenue data for past and future months', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('revenueByMonth', 7)
        );
});

test('dashboard returns vehicle status counts', function () {
    $user = User::factory()->create();

    Vehicle::factory()->count(3)->create(['status' => 'available']);
    Vehicle::factory()->count(2)->create(['status' => 'rented']);
    Vehicle::factory()->create(['status' => 'maintenance']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('vehicleStatusCounts.available', 3)
            ->where('vehicleStatusCounts.rented', 2)
            ->where('vehicleStatusCounts.maintenance', 1)
        );
});

test('dashboard returns recent bookings limited to 8', function () {
    $user = User::factory()->create();

    Booking::factory()->count(12)->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('recentBookings', 8)
        );
});

test('dashboard returns active maintenance vehicles', function () {
    $user = User::factory()->create();

    Maintenance::factory()->ongoing()->create();

    Maintenance::factory()->create([
        'start_date' => now(),
        'end_date' => now()->addDays(10),
    ]);

    Maintenance::factory()->create([
        'start_date' => now()->subDays(30),
        'end_date' => now()->subDays(10),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('maintenanceVehicles', 2)
        );
});
