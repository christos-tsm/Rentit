<?php

namespace Database\Factories;

use App\Models\YieldRule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<YieldRule>
 */
class YieldRuleFactory extends Factory
{
    protected $model = YieldRule::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'min_available_vehicles' => 2,
            'price_increase_percentage' => 15.00,
            'is_active' => true,
        ];
    }
}
