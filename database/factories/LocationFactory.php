<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Location>
 */
class LocationFactory extends Factory
{
    protected $model = Location::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'address' => fake()->address(),
            'email' => fake()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'coordinates' => fake()->latitude().', '.fake()->longitude(),
            'operating_hours' => '08:00-20:00',
            'type' => fake()->randomElement(['airport', 'office', 'hotel', 'port', 'other']),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function airport(): static
    {
        return $this->state(fn () => ['type' => 'airport']);
    }
}
