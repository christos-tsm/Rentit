<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'driver_license_number' => fake()->bothify('??######'),
            'date_of_birth' => fake()->dateTimeBetween('-70 years', '-20 years')->format('Y-m-d'),
            'address' => fake()->address(),
            'notes' => null,
        ];
    }
}
