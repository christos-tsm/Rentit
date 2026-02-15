<?php

use App\Models\User;
use App\Models\VehicleMake;

test('guests cannot access makes page', function () {
    $this->get(route('admin.makes.index'))->assertRedirect(route('login'));
});

test('authenticated users can view makes index', function () {
    $user = User::factory()->create();
    VehicleMake::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.makes.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/makes/index')
            ->has('makes.data', 3)
        );
});

test('a make can be created', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.makes.store'), ['name' => 'Volkswagen'])
        ->assertRedirect();

    $this->assertDatabaseHas('vehicle_makes', ['name' => 'Volkswagen']);
});

test('a make requires a name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.makes.store'), ['name' => ''])
        ->assertSessionHasErrors('name');
});

test('a make name must be unique', function () {
    $user = User::factory()->create();
    VehicleMake::factory()->create(['name' => 'Toyota']);

    $this->actingAs($user)
        ->post(route('admin.makes.store'), ['name' => 'Toyota'])
        ->assertSessionHasErrors('name');
});

test('a make can be updated', function () {
    $user = User::factory()->create();
    $make = VehicleMake::factory()->create(['name' => 'Toyotas']);

    $this->actingAs($user)
        ->put(route('admin.makes.update', $make), ['name' => 'Toyota'])
        ->assertRedirect();

    $this->assertDatabaseHas('vehicle_makes', ['id' => $make->id, 'name' => 'Toyota']);
});

test('a make can be deleted', function () {
    $user = User::factory()->create();
    $make = VehicleMake::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.makes.destroy', $make))
        ->assertRedirect();

    $this->assertDatabaseMissing('vehicle_makes', ['id' => $make->id]);
});
