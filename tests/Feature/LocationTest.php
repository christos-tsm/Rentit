<?php

use App\Models\Location;
use App\Models\User;

test('guests cannot access locations page', function () {
    $this->get(route('admin.locations.index'))->assertRedirect(route('login'));
});

test('authenticated users can view locations index', function () {
    $user = User::factory()->create();
    Location::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.locations.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/locations/index')
            ->has('locations.data', 3)
        );
});

test('a location can be created', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.locations.store'), [
            'name' => 'Αεροδρόμιο Ηρακλείου',
            'address' => 'Λεωφ. Ικάρου, Ηράκλειο',
            'email' => 'info@heraklion-airport.gr',
            'phone' => '+30 2810 397800',
            'type' => 'airport',
            'is_active' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('locations', [
        'name' => 'Αεροδρόμιο Ηρακλείου',
        'type' => 'airport',
    ]);
});

test('a location requires a name and type', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.locations.store'), ['name' => '', 'type' => ''])
        ->assertSessionHasErrors(['name', 'type']);
});

test('location type must be valid', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.locations.store'), [
            'name' => 'Test',
            'type' => 'invalid_type',
        ])
        ->assertSessionHasErrors('type');
});

test('a location can be updated', function () {
    $user = User::factory()->create();
    $location = Location::factory()->create(['name' => 'Old Name']);

    $this->actingAs($user)
        ->put(route('admin.locations.update', $location), [
            'name' => 'New Name',
            'address' => 'New Address',
            'type' => 'office',
            'is_active' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('locations', [
        'id' => $location->id,
        'name' => 'New Name',
        'is_active' => false,
    ]);
});

test('a location can be deleted', function () {
    $user = User::factory()->create();
    $location = Location::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.locations.destroy', $location))
        ->assertRedirect();

    $this->assertDatabaseMissing('locations', ['id' => $location->id]);
});
