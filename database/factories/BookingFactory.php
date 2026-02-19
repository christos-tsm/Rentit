<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Customer;
use App\Models\Location;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pickup = fake()->dateTimeBetween('+1 day', '+30 days');
        $return = fake()->dateTimeBetween($pickup, '+60 days');

        return [
            'customer_id' => Customer::factory(),
            'vehicle_id' => Vehicle::factory(),
            'pickup_location_id' => Location::factory(),
            'return_location_id' => Location::factory(),
            'pickup_date' => $pickup,
            'return_date' => $return,
            'total_price' => fake()->randomFloat(2, 100, 2000),
            'status' => fake()->randomElement(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
            'driver_age' => fake()->numberBetween(18, 80),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn () => ['status' => 'confirmed']);
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }
}
