<?php

use App\Models\User;
use App\Models\VehicleCategory;

test('guests cannot access categories page', function () {
    $this->get(route('admin.categories.index'))->assertRedirect(route('login'));
});

test('authenticated users can view categories index', function () {
    $user = User::factory()->create();
    VehicleCategory::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/categories/index')
            ->has('categories', 3)
        );
});

test('a category can be created', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.categories.store'), [
            'name' => 'SUV',
            'description' => 'Sport utility vehicles',
            'base_price_per_day' => 75.00,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('vehicle_categories', [
        'name' => 'SUV',
        'slug' => 'suv',
        'base_price_per_day' => 75.00,
    ]);
});

test('a category requires a name and price', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.categories.store'), ['name' => '', 'base_price_per_day' => ''])
        ->assertSessionHasErrors(['name', 'base_price_per_day']);
});

test('a category name must be unique', function () {
    $user = User::factory()->create();
    VehicleCategory::factory()->create(['name' => 'SUV']);

    $this->actingAs($user)
        ->post(route('admin.categories.store'), [
            'name' => 'SUV',
            'base_price_per_day' => 50.00,
        ])
        ->assertSessionHasErrors('name');
});

test('a category can be updated', function () {
    $user = User::factory()->create();
    $category = VehicleCategory::factory()->create(['name' => 'Sedna']);

    $this->actingAs($user)
        ->put(route('admin.categories.update', $category), [
            'name' => 'Sedan',
            'base_price_per_day' => 40.00,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('vehicle_categories', [
        'id' => $category->id,
        'name' => 'Sedan',
        'slug' => 'sedan',
    ]);
});

test('a category can be deleted', function () {
    $user = User::factory()->create();
    $category = VehicleCategory::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect();

    $this->assertDatabaseMissing('vehicle_categories', ['id' => $category->id]);
});
