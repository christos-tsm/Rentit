<?php

namespace Database\Factories;

use App\Models\Fee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Fee>
 */
class FeeFactory extends Factory
{
    protected $model = Fee::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'type' => 'fixed',
            'amount' => fake()->randomFloat(2, 5, 50),
            'applies_to' => 'all',
            'description' => null,
            'is_active' => true,
        ];
    }
}
