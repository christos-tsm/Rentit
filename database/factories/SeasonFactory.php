<?php

namespace Database\Factories;

use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Season>
 */
class SeasonFactory extends Factory
{
    protected $model = Season::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Low Season', 'Mid Season', 'High Season', 'Peak Season']),
            'start_date' => '2000-01-01',
            'end_date' => '2000-03-31',
            'is_recurring' => true,
            'priority' => 0,
            'is_active' => true,
        ];
    }

    public function yearly(int $year = 2026): static
    {
        return $this->state(fn () => [
            'is_recurring' => false,
            'start_date' => "{$year}-06-15",
            'end_date' => "{$year}-09-15",
            'priority' => 10,
        ]);
    }
}
