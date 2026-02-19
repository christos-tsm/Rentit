<?php

namespace Database\Factories;

use App\Models\DriverAgeSurcharge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DriverAgeSurcharge>
 */
class DriverAgeSurchargeFactory extends Factory
{
    protected $model = DriverAgeSurcharge::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Young driver surcharge',
            'min_age' => 18,
            'max_age' => 25,
            'surcharge_type' => 'fixed',
            'amount' => 10.00,
            'is_active' => true,
        ];
    }
}
