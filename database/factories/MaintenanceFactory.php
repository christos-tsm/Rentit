<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Maintenance>
 */
class MaintenanceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-30 days', '+10 days');

        return [
            'vehicle_id' => Vehicle::factory(),
            'description' => fake()->sentence(),
            'start_date' => $start,
            'end_date' => fake()->optional(0.6)->dateTimeBetween($start, '+30 days'),
            'cost' => fake()->randomFloat(2, 50, 1500),
        ];
    }

    public function ongoing(): static
    {
        return $this->state(fn () => ['end_date' => null]);
    }
}
