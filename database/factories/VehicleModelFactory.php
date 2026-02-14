<?php

namespace Database\Factories;

use App\Models\VehicleMake;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehicleModel>
 */
class VehicleModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_make_id' => VehicleMake::factory(),
            'name' => fake()->unique()->words(2, true),
        ];
    }
}
