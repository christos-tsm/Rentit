<?php

namespace Database\Factories;

use App\Models\DurationDiscount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DurationDiscount>
 */
class DurationDiscountFactory extends Factory
{
    protected $model = DurationDiscount::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'min_days' => 1,
            'max_days' => 3,
            'discount_percentage' => 0,
            'is_active' => true,
        ];
    }
}
