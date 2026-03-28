<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Models\Maintenance;
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
     * Sum of revenue for bookings with a given status in a specific month/year.
     */
    public function getMonthlyRevenue(int $month, int $year): float
    {
        return (float) Booking::query()
            ->whereIn('status', ['completed', 'active', 'confirmed'])
            ->whereMonth('pickup_date', $month)
            ->whereYear('pickup_date', $year)
            ->sum('total_price');
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

    public function getRecentBookings(int $limit = 8): Collection
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
     * Active maintenance records (no end_date or end_date >= today).
     */
    public function getActiveMaintenances(Carbon $now): Collection
    {
        return Maintenance::query()
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $now->toDateString());
            })
            ->with([
                'vehicle:id,plate_number,vehicle_model_id,status',
                'vehicle.vehicleModel:id,name,vehicle_make_id',
                'vehicle.vehicleModel.make:id,name',
            ])
            ->select('id', 'vehicle_id', 'description', 'start_date', 'end_date', 'cost')
            ->orderBy('start_date', 'desc')
            ->get();
    }
}
