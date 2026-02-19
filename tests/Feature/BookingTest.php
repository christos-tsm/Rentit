<?php

use App\Models\Booking;
use App\Models\Customer;
use App\Models\Location;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleCategory;

test('guests cannot access bookings page', function () {
    $this->get(route('bookings.index'))->assertRedirect(route('login'));
});

test('authenticated users can view bookings index', function () {
    $user = User::factory()->create();
    Booking::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('bookings.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('bookings/index')
            ->has('bookings.data', 3)
        );
});

test('bookings can be filtered by status', function () {
    $user = User::factory()->create();
    Booking::factory()->count(2)->create(['status' => 'confirmed']);
    Booking::factory()->count(3)->create(['status' => 'pending']);

    $this->actingAs($user)
        ->get(route('bookings.index', ['status' => 'confirmed']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 2)
        );
});

test('a booking can be created with pricing calculation', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create();
    $category = VehicleCategory::factory()->create(['base_price_per_day' => 50]);
    $vehicle = Vehicle::factory()->create(['vehicle_category_id' => $category->id, 'status' => 'available']);
    $pickupLocation = Location::factory()->create();
    $returnLocation = Location::factory()->create();

    $this->actingAs($user)
        ->post(route('bookings.store'), [
            'customer_id' => $customer->id,
            'vehicle_id' => $vehicle->id,
            'vehicle_category_id' => $category->id,
            'pickup_location_id' => $pickupLocation->id,
            'return_location_id' => $returnLocation->id,
            'pickup_date' => '2026-07-01 10:00:00',
            'return_date' => '2026-07-04 10:00:00',
            'status' => 'pending',
        ])
        ->assertRedirect(route('bookings.index'));

    $this->assertDatabaseHas('bookings', [
        'customer_id' => $customer->id,
        'vehicle_id' => $vehicle->id,
        'status' => 'pending',
    ]);

    $booking = Booking::latest()->first();
    expect($booking->total_price)->toBe('150.00')
        ->and($booking->price_breakdown)->toBeArray()
        ->and((float) $booking->price_breakdown['base_total'])->toBe(150.0);
});

test('booking store requires all fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('bookings.store'), [])
        ->assertSessionHasErrors([
            'customer_id',
            'vehicle_id',
            'vehicle_category_id',
            'pickup_location_id',
            'return_location_id',
            'pickup_date',
            'return_date',
        ]);
});

test('a booking can be viewed', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($user)
        ->get(route('bookings.show', $booking))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('bookings/show')
            ->has('booking')
        );
});

test('a booking status can be updated', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['status' => 'pending']);

    $this->actingAs($user)
        ->put(route('bookings.update', $booking), [
            'status' => 'confirmed',
            'notes' => 'Customer confirmed by phone',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'status' => 'confirmed',
        'notes' => 'Customer confirmed by phone',
    ]);
});

test('a booking can be deleted', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($user)
        ->delete(route('bookings.destroy', $booking))
        ->assertRedirect(route('bookings.index'));

    $this->assertDatabaseMissing('bookings', ['id' => $booking->id]);
});

test('price calculation API returns breakdown', function () {
    $user = User::factory()->create();
    $category = VehicleCategory::factory()->create(['base_price_per_day' => 50]);
    $pickupLocation = Location::factory()->create();
    $returnLocation = Location::factory()->create();

    $this->actingAs($user)
        ->postJson(route('api.calculate-price'), [
            'vehicle_category_id' => $category->id,
            'pickup_date' => '2026-07-01',
            'return_date' => '2026-07-04',
            'pickup_location_id' => $pickupLocation->id,
            'return_location_id' => $returnLocation->id,
        ])
        ->assertOk()
        ->assertJsonStructure([
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
        ])
        ->assertJson([
            'base_total' => 150.0,
            'grand_total' => 150.0,
            'total_days' => 3,
        ]);
});
