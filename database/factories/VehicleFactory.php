<?php

namespace Database\Factories;

use App\Models\VehicleCategory;
use App\Models\VehicleModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_category_id' => VehicleCategory::factory(),
            'vehicle_model_id' => VehicleModel::factory(),
            'plate_number' => fake()->unique()->regexify('[A-Z]{3}-[0-9]{4}'),
            'cc' => fake()->randomElement([1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000]),
            'seats' => fake()->numberBetween(2, 9),
            'large_bags_capacity' => fake()->numberBetween(1, 4),
            'small_bags_capacity' => fake()->numberBetween(1, 4),
            'doors' => fake()->randomElement([2, 3, 4, 5]),
            'ac' => fake()->boolean(90),
            'gears' => fake()->randomElement([5, 6, 7, 8]),
            'hp' => fake()->numberBetween(60, 400),
            'base_price' => fake()->randomFloat(2, 20, 200),
            'vin' => fake()->optional()->regexify('[A-Z0-9]{17}'),
            'fuel_type' => fake()->randomElement(['petrol', 'diesel', 'electric', 'hybrid']),
            'transmission' => fake()->randomElement(['manual', 'automatic']),
            'status' => fake()->randomElement(['available', 'rented', 'maintenance', 'out_of_service']),
            'current_km' => fake()->numberBetween(0, 200000),
            'image_path' => null,
        ];
    }
}
