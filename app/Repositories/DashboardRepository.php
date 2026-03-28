<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DashboardRepository
{
    /**
     * Bookings that overlap with a given date range, excluding cancelled.
     */
    public function getCalendarBookings(Carbon $start, Carbon $end): Collection
    {
        return Booking::query()
            ->where('pickup_date', '<=', $end)
            ->where('return_date', '>=', $start)
            ->whereNotIn('status', ['cancelled'])
            ->with([
                'customer:id,first_name,last_name',
                'vehicle:id,plate_number,vehicle_model_id',
                'vehicle.vehicleModel:id,name,vehicle_make_id',
                'vehicle.vehicleModel.make:id,name',
            ])
            ->select('id', 'customer_id', 'vehicle_id', 'pickup_date', 'return_date', 'status', 'total_price')
            ->orderBy('pickup_date')
            ->get();
    }

    /**
     * Monthly revenue aggregated between two dates, keyed by "YYYY-MM".
     *
     * @return Collection<string, float>
     */
    public function getMonthlyRevenue(Carbon $start, Carbon $end): Collection
    {
        return Booking::query()
            ->whereIn('status', ['completed', 'active', 'confirmed'])
            ->where('pickup_date', '>=', $start)
            ->where('pickup_date', '<=', $end)
            ->selectRaw('SUBSTR(pickup_date, 1, 7) as month_key, SUM(total_price) as revenue')
            ->groupBy('month_key')
            ->orderBy('month_key')
            ->pluck('revenue', 'month_key');
    }

    /**
     * @return array<string, int>
     */
    public function getVehicleStatusCounts(): array
    {
        return Vehicle::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function getRecentBookings(int $limit = 10): Collection
    {
        return Booking::query()
            ->with([
                'customer:id,first_name,last_name',
                'vehicle:id,plate_number,vehicle_model_id',
                'vehicle.vehicleModel:id,name,vehicle_make_id',
                'vehicle.vehicleModel.make:id,name',
            ])
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Vehicles currently in maintenance status, with their latest maintenance record if available.
     */
    public function getMaintenanceVehicles(int $limit = 5): Collection
    {
        return Vehicle::query()
            ->where('status', 'maintenance')
            ->with([
                'vehicleModel:id,name,vehicle_make_id',
                'vehicleModel.make:id,name',
                'maintenances' => fn ($q) => $q->latest('start_date')->limit(1),
            ])
            ->select('id', 'plate_number', 'vehicle_model_id', 'status')
            ->latest('updated_at')
            ->limit($limit)
            ->get();
    }

    public function getMaintenanceVehicleCount(): int
    {
        return Vehicle::query()
            ->where('status', 'maintenance')
            ->count();
    }
}
