<?php

use App\Models\User;
use App\Models\VehicleMake;
use App\Models\VehicleModel;

test('guests cannot access models page', function () {
    $this->get(route('admin.models.index'))->assertRedirect(route('login'));
});

test('authenticated users can view models index', function () {
    $user = User::factory()->create();
    VehicleModel::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.models.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/models/index')
            ->has('models.data', 3)
            ->has('makes')
        );
});

test('models can be filtered by make', function () {
    $user = User::factory()->create();
    $toyota = VehicleMake::factory()->create(['name' => 'Toyota']);
    $bmw = VehicleMake::factory()->create(['name' => 'BMW']);

    VehicleModel::factory()->create(['vehicle_make_id' => $toyota->id, 'name' => 'Corolla']);
    VehicleModel::factory()->create(['vehicle_make_id' => $toyota->id, 'name' => 'Yaris']);
    VehicleModel::factory()->create(['vehicle_make_id' => $bmw->id, 'name' => 'X5']);

    $this->actingAs($user)
        ->get(route('admin.models.index', ['make_id' => $toyota->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/models/index')
            ->has('models.data', 2)
        );
});

test('a model can be created', function () {
    $user = User::factory()->create();
    $make = VehicleMake::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.models.store'), [
            'vehicle_make_id' => $make->id,
            'name' => 'Golf 1.6',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('vehicle_models', [
        'vehicle_make_id' => $make->id,
        'name' => 'Golf 1.6',
    ]);
});

test('a model requires a name and make', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.models.store'), ['vehicle_make_id' => '', 'name' => ''])
        ->assertSessionHasErrors(['vehicle_make_id', 'name']);
});

test('a model name must be unique within the same make', function () {
    $user = User::factory()->create();
    $make = VehicleMake::factory()->create();
    VehicleModel::factory()->create(['vehicle_make_id' => $make->id, 'name' => 'Golf']);

    $this->actingAs($user)
        ->post(route('admin.models.store'), [
            'vehicle_make_id' => $make->id,
            'name' => 'Golf',
        ])
        ->assertSessionHasErrors('name');
});

test('same model name is allowed under different makes', function () {
    $user = User::factory()->create();
    $vw = VehicleMake::factory()->create(['name' => 'Volkswagen']);
    $other = VehicleMake::factory()->create(['name' => 'Other']);
    VehicleModel::factory()->create(['vehicle_make_id' => $vw->id, 'name' => 'Classic']);

    $this->actingAs($user)
        ->post(route('admin.models.store'), [
            'vehicle_make_id' => $other->id,
            'name' => 'Classic',
        ])
        ->assertRedirect();

    $this->assertDatabaseCount('vehicle_models', 2);
});

test('a model can be updated', function () {
    $user = User::factory()->create();
    $model = VehicleModel::factory()->create(['name' => 'Golf 1.4']);

    $this->actingAs($user)
        ->put(route('admin.models.update', $model), [
            'vehicle_make_id' => $model->vehicle_make_id,
            'name' => 'Golf 1.6',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('vehicle_models', ['id' => $model->id, 'name' => 'Golf 1.6']);
});

test('a model can be deleted', function () {
    $user = User::factory()->create();
    $model = VehicleModel::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.models.destroy', $model))
        ->assertRedirect();

    $this->assertDatabaseMissing('vehicle_models', ['id' => $model->id]);
});
