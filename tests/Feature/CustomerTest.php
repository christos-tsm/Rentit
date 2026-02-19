<?php

use App\Models\Customer;
use App\Models\User;

test('guests cannot access customers page', function () {
    $this->get(route('admin.customers.index'))->assertRedirect(route('login'));
});

test('authenticated users can view customers index', function () {
    $user = User::factory()->create();
    Customer::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.customers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/customers/index')
            ->has('customers.data', 3)
        );
});

test('a customer can be created', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.customers.store'), [
            'first_name' => 'Γιάννης',
            'last_name' => 'Παπαδόπουλος',
            'email' => 'giannis@example.com',
            'phone' => '+30 210 1234567',
            'driver_license_number' => 'AB123456',
            'date_of_birth' => '1990-05-15',
            'address' => 'Λεωφ. Αλεξάνδρας 100',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('customers', [
        'first_name' => 'Γιάννης',
        'last_name' => 'Παπαδόπουλος',
        'email' => 'giannis@example.com',
    ]);
});

test('customer creation requires mandatory fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.customers.store'), [
            'first_name' => '',
            'last_name' => '',
            'email' => '',
            'phone' => '',
            'driver_license_number' => '',
        ])
        ->assertSessionHasErrors(['first_name', 'last_name', 'email', 'phone', 'driver_license_number']);
});

test('customer email must be unique', function () {
    $user = User::factory()->create();
    Customer::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($user)
        ->post(route('admin.customers.store'), [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'taken@example.com',
            'phone' => '1234567890',
            'driver_license_number' => 'XX000000',
        ])
        ->assertSessionHasErrors('email');
});

test('a customer can be updated', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['first_name' => 'Old']);

    $this->actingAs($user)
        ->put(route('admin.customers.update', $customer), [
            'first_name' => 'New',
            'last_name' => $customer->last_name,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'driver_license_number' => $customer->driver_license_number,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'first_name' => 'New',
    ]);
});

test('a customer can be deleted', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.customers.destroy', $customer))
        ->assertRedirect();

    $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
});
