<?php

namespace Database\Factories;

use App\Models\Extra;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Extra>
 */
class ExtraFactory extends Factory
{
    protected $model = Extra::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['GPS', 'Child seat', 'Full insurance', 'Additional driver']),
            'price_per_day' => fake()->randomFloat(2, 3, 20),
            'type' => 'per_day',
            'description' => null,
            'is_active' => true,
        ];
    }
}
