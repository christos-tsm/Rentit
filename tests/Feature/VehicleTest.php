<?php

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleCategory;
use App\Models\VehicleMake;
use App\Models\VehicleModel;

test('guests are redirected to the login page', function () {
    $this->get(route('vehicles.index'))->assertRedirect(route('login'));
});

test('authenticated users can view vehicles index', function () {
    $user = User::factory()->create();
    Vehicle::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('vehicles.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles')
            ->has('makes')
            ->has('categories')
            ->has('filters')
        );
});

test('vehicles index paginates results', function () {
    $user = User::factory()->create();
    Vehicle::factory()->count(20)->create();

    $this->actingAs($user)
        ->get(route('vehicles.index', ['rpp' => 5]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 5)
        );
});

test('vehicles index can filter by make', function () {
    $user = User::factory()->create();

    $toyota = VehicleMake::factory()->create(['name' => 'Toyota']);
    $honda = VehicleMake::factory()->create(['name' => 'Honda']);
    $toyotaModel = VehicleModel::factory()->create(['vehicle_make_id' => $toyota->id, 'name' => 'Corolla']);
    $hondaModel = VehicleModel::factory()->create(['vehicle_make_id' => $honda->id, 'name' => 'Civic']);

    Vehicle::factory()->create(['vehicle_model_id' => $toyotaModel->id]);
    Vehicle::factory()->create(['vehicle_model_id' => $hondaModel->id]);

    $this->actingAs($user)
        ->get(route('vehicles.index', ['make_id' => $toyota->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 1)
        );
});

test('vehicles index can filter by search key', function () {
    $user = User::factory()->create();

    $toyota = VehicleMake::factory()->create(['name' => 'Toyota']);
    $honda = VehicleMake::factory()->create(['name' => 'Honda']);
    $toyotaModel = VehicleModel::factory()->create(['vehicle_make_id' => $toyota->id, 'name' => 'Corolla']);
    $hondaModel = VehicleModel::factory()->create(['vehicle_make_id' => $honda->id, 'name' => 'Civic']);

    Vehicle::factory()->create(['vehicle_model_id' => $toyotaModel->id]);
    Vehicle::factory()->create(['vehicle_model_id' => $hondaModel->id]);

    $this->actingAs($user)
        ->get(route('vehicles.index', ['search' => 'Toyota']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 1)
        );
});

test('vehicles index can filter by category', function () {
    $user = User::factory()->create();

    $suv = VehicleCategory::factory()->create(['name' => 'SUV']);
    $sedan = VehicleCategory::factory()->create(['name' => 'Sedan']);

    Vehicle::factory()->create(['vehicle_category_id' => $suv->id]);
    Vehicle::factory()->create(['vehicle_category_id' => $suv->id]);
    Vehicle::factory()->create(['vehicle_category_id' => $sedan->id]);

    $this->actingAs($user)
        ->get(route('vehicles.index', ['category_id' => $suv->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 2)
        );
});

test('vehicles index can filter by status', function () {
    $user = User::factory()->create();

    Vehicle::factory()->create(['status' => 'available']);
    Vehicle::factory()->create(['status' => 'available']);
    Vehicle::factory()->create(['status' => 'rented']);
    Vehicle::factory()->create(['status' => 'maintenance']);

    $this->actingAs($user)
        ->get(route('vehicles.index', ['status' => 'available']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 2)
        );
});

test('vehicles index can search by VIN', function () {
    $user = User::factory()->create();

    Vehicle::factory()->create(['vin' => 'WVWZZZ3CZWE123456']);
    Vehicle::factory()->create(['vin' => 'JTDKN3DU5A0000001']);
    Vehicle::factory()->create(['vin' => null]);

    $this->actingAs($user)
        ->get(route('vehicles.index', ['search' => 'WVWZZZ']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 1)
        );
});

test('vehicles index can search by plate number', function () {
    $user = User::factory()->create();

    Vehicle::factory()->create(['plate_number' => 'ΑΒΓ-1234']);
    Vehicle::factory()->create(['plate_number' => 'ΔΕΖ-5678']);

    $this->actingAs($user)
        ->get(route('vehicles.index', ['search' => 'ΑΒΓ']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 1)
        );
});

test('vehicles index can combine multiple filters', function () {
    $user = User::factory()->create();

    $suv = VehicleCategory::factory()->create(['name' => 'SUV']);
    $sedan = VehicleCategory::factory()->create(['name' => 'Sedan']);

    Vehicle::factory()->create(['vehicle_category_id' => $suv->id, 'status' => 'available']);
    Vehicle::factory()->create(['vehicle_category_id' => $suv->id, 'status' => 'rented']);
    Vehicle::factory()->create(['vehicle_category_id' => $sedan->id, 'status' => 'available']);

    $this->actingAs($user)
        ->get(route('vehicles.index', ['category_id' => $suv->id, 'status' => 'available']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles.data', 1)
        );
});

test('vehicles index validates request parameters', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('vehicles.index', ['rpp' => 'invalid']))
        ->assertSessionHasErrors('rpp');
});

// --- Create page ---

test('guests cannot access vehicle create page', function () {
    $this->get(route('vehicles.create'))->assertRedirect(route('login'));
});

test('authenticated users can view vehicle create page', function () {
    $user = User::factory()->create();
    VehicleMake::factory()->count(2)->create();
    VehicleCategory::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('vehicles.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/create')
            ->has('makes', 2)
            ->has('categories', 3)
        );
});

// --- Store ---

test('a vehicle can be created', function () {
    $user = User::factory()->create();
    $category = VehicleCategory::factory()->create();
    $model = VehicleModel::factory()->create();

    $this->actingAs($user)
        ->post(route('vehicles.store'), [
            'vehicle_category_id' => $category->id,
            'vehicle_model_id' => $model->id,
            'plate_number' => 'ΑΒΓ-1234',
            'cc' => 1600,
            'seats' => 5,
            'large_bags_capacity' => 2,
            'small_bags_capacity' => 2,
            'doors' => 5,
            'ac' => true,
            'gears' => 6,
            'hp' => 120,
            'base_price' => 45.00,
            'vin' => 'WVWZZZ3CZWE123456',
            'fuel_type' => 'petrol',
            'transmission' => 'manual',
            'current_km' => 15000,
        ])
        ->assertRedirect(route('vehicles.index'));

    $this->assertDatabaseHas('vehicles', [
        'plate_number' => 'ΑΒΓ-1234',
        'vehicle_model_id' => $model->id,
        'vehicle_category_id' => $category->id,
        'cc' => 1600,
        'seats' => 5,
    ]);
});

test('vehicle creation requires mandatory fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('vehicles.store'), [])
        ->assertSessionHasErrors([
            'vehicle_category_id',
            'vehicle_model_id',
            'plate_number',
            'cc',
            'seats',
            'large_bags_capacity',
            'small_bags_capacity',
            'doors',
            'ac',
            'gears',
            'hp',
            'base_price',
            'fuel_type',
            'transmission',
            'current_km',
        ]);
});

test('vehicle plate number must be unique', function () {
    $user = User::factory()->create();
    Vehicle::factory()->create(['plate_number' => 'ΑΒΓ-1234']);

    $model = VehicleModel::factory()->create();
    $category = VehicleCategory::factory()->create();

    $this->actingAs($user)
        ->post(route('vehicles.store'), [
            'vehicle_category_id' => $category->id,
            'vehicle_model_id' => $model->id,
            'plate_number' => 'ΑΒΓ-1234',
            'cc' => 1600,
            'seats' => 5,
            'large_bags_capacity' => 2,
            'small_bags_capacity' => 2,
            'doors' => 5,
            'ac' => true,
            'gears' => 6,
            'hp' => 120,
            'base_price' => 45.00,
            'fuel_type' => 'diesel',
            'transmission' => 'automatic',
            'current_km' => 0,
        ])
        ->assertSessionHasErrors('plate_number');
});

test('vehicle fuel type must be valid', function () {
    $user = User::factory()->create();
    $model = VehicleModel::factory()->create();
    $category = VehicleCategory::factory()->create();

    $this->actingAs($user)
        ->post(route('vehicles.store'), [
            'vehicle_category_id' => $category->id,
            'vehicle_model_id' => $model->id,
            'plate_number' => 'ΑΒΓ-9999',
            'cc' => 1600,
            'seats' => 5,
            'large_bags_capacity' => 2,
            'small_bags_capacity' => 2,
            'doors' => 5,
            'ac' => true,
            'gears' => 6,
            'hp' => 120,
            'base_price' => 45.00,
            'fuel_type' => 'water',
            'transmission' => 'manual',
            'current_km' => 0,
        ])
        ->assertSessionHasErrors('fuel_type');
});

// --- Update ---

test('a vehicle can be updated', function () {
    $user = User::factory()->create();
    $vehicle = Vehicle::factory()->create(['plate_number' => 'ΑΒΓ-1234', 'ac' => true]);
    $newCategory = VehicleCategory::factory()->create();
    $newModel = VehicleModel::factory()->create();

    $this->actingAs($user)
        ->put(route('vehicles.update', $vehicle), [
            'vehicle_category_id' => $newCategory->id,
            'vehicle_model_id' => $newModel->id,
            'plate_number' => 'ΔΕΖ-5678',
            'cc' => 2000,
            'seats' => 5,
            'large_bags_capacity' => 3,
            'small_bags_capacity' => 2,
            'doors' => 4,
            'ac' => false,
            'gears' => 5,
            'hp' => 150,
            'base_price' => 55.00,
            'vin' => 'WVWZZZ3CZWE999999',
            'fuel_type' => 'diesel',
            'transmission' => 'automatic',
            'current_km' => 25000,
        ])
        ->assertRedirect(route('vehicles.index'));

    $this->assertDatabaseHas('vehicles', [
        'id' => $vehicle->id,
        'plate_number' => 'ΔΕΖ-5678',
        'ac' => false,
        'vehicle_model_id' => $newModel->id,
        'vehicle_category_id' => $newCategory->id,
    ]);
});

test('updating a vehicle allows keeping the same plate number', function () {
    $user = User::factory()->create();
    $vehicle = Vehicle::factory()->create(['plate_number' => 'ΑΒΓ-1234']);

    $this->actingAs($user)
        ->put(route('vehicles.update', $vehicle), [
            'vehicle_category_id' => $vehicle->vehicle_category_id,
            'vehicle_model_id' => $vehicle->vehicle_model_id,
            'plate_number' => 'ΑΒΓ-1234',
            'cc' => $vehicle->cc,
            'seats' => $vehicle->seats,
            'large_bags_capacity' => $vehicle->large_bags_capacity,
            'small_bags_capacity' => $vehicle->small_bags_capacity,
            'doors' => $vehicle->doors,
            'ac' => $vehicle->ac,
            'gears' => $vehicle->gears,
            'hp' => $vehicle->hp,
            'base_price' => $vehicle->base_price,
            'fuel_type' => $vehicle->fuel_type,
            'transmission' => $vehicle->transmission,
            'current_km' => $vehicle->current_km,
        ])
        ->assertRedirect(route('vehicles.index'));
});

test('updating a vehicle rejects a plate number used by another vehicle', function () {
    $user = User::factory()->create();
    Vehicle::factory()->create(['plate_number' => 'ΑΒΓ-1234']);
    $vehicle = Vehicle::factory()->create(['plate_number' => 'ΔΕΖ-5678']);

    $this->actingAs($user)
        ->put(route('vehicles.update', $vehicle), [
            'vehicle_category_id' => $vehicle->vehicle_category_id,
            'vehicle_model_id' => $vehicle->vehicle_model_id,
            'plate_number' => 'ΑΒΓ-1234',
            'cc' => $vehicle->cc,
            'seats' => $vehicle->seats,
            'large_bags_capacity' => $vehicle->large_bags_capacity,
            'small_bags_capacity' => $vehicle->small_bags_capacity,
            'doors' => $vehicle->doors,
            'ac' => $vehicle->ac,
            'gears' => $vehicle->gears,
            'hp' => $vehicle->hp,
            'base_price' => $vehicle->base_price,
            'fuel_type' => $vehicle->fuel_type,
            'transmission' => $vehicle->transmission,
            'current_km' => $vehicle->current_km,
        ])
        ->assertSessionHasErrors('plate_number');
});

test('updating a vehicle requires vehicle model id', function () {
    $user = User::factory()->create();
    $vehicle = Vehicle::factory()->create();

    $this->actingAs($user)
        ->put(route('vehicles.update', $vehicle), [
            'vehicle_category_id' => $vehicle->vehicle_category_id,
            'vehicle_model_id' => '',
            'plate_number' => $vehicle->plate_number,
            'cc' => $vehicle->cc,
            'seats' => $vehicle->seats,
            'large_bags_capacity' => $vehicle->large_bags_capacity,
            'small_bags_capacity' => $vehicle->small_bags_capacity,
            'doors' => $vehicle->doors,
            'ac' => $vehicle->ac,
            'gears' => $vehicle->gears,
            'hp' => $vehicle->hp,
            'base_price' => $vehicle->base_price,
            'fuel_type' => $vehicle->fuel_type,
            'transmission' => $vehicle->transmission,
            'current_km' => $vehicle->current_km,
        ])
        ->assertSessionHasErrors('vehicle_model_id');
});

// --- API: vehicle models by make ---

test('api returns vehicle models for a given make', function () {
    $user = User::factory()->create();
    $make = VehicleMake::factory()->create();
    VehicleModel::factory()->count(3)->create(['vehicle_make_id' => $make->id]);
    VehicleModel::factory()->count(2)->create(); // other make

    $this->actingAs($user)
        ->getJson(route('api.vehicle-models', ['make_id' => $make->id]))
        ->assertOk()
        ->assertJsonCount(3);
});
