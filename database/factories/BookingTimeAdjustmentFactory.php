<?php

namespace Database\Factories;

use App\Models\BookingTimeAdjustment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BookingTimeAdjustment>
 */
class BookingTimeAdjustmentFactory extends Factory
{
    protected $model = BookingTimeAdjustment::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'type' => 'early_bird',
            'min_days_before' => 90,
            'max_days_before' => null,
            'adjustment_type' => 'discount',
            'percentage' => 10.00,
            'is_active' => true,
        ];
    }
}
