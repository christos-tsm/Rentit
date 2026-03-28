<?php

namespace App\Services;

use App\Repositories\DashboardRepository;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(
        private DashboardRepository $dashboardRepository,
    ) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getCalendarBookings(): array
    {
        $now = Carbon::now();
        $start = $now->copy()->subMonth()->startOfMonth();
        $end = $now->copy()->addMonths(12)->endOfMonth();

        return $this->dashboardRepository->getCalendarBookings($start, $end)->toArray();
    }

    /**
     * Monthly revenue for the full current year (Jan–Dec).
     *
     * @return array<int, array{month: string, revenue: float}>
     */
    public function getRevenueByMonth(): array
    {
        $now = Carbon::now();
        $start = $now->copy()->startOfYear();
        $end = $now->copy()->endOfYear();

        $revenueMap = $this->dashboardRepository->getMonthlyRevenue($start, $end);

        $data = [];
        $cursor = $start->copy();

        while ($cursor->lte($end)) {
            $key = $cursor->format('Y-m');
            $data[] = [
                'month' => $cursor->translatedFormat('M'),
                'revenue' => round((float) ($revenueMap[$key] ?? 0), 2),
            ];
            $cursor->addMonth();
        }

        return $data;
    }

    /**
     * @return array<string, int>
     */
    public function getVehicleStatusCounts(): array
    {
        return $this->dashboardRepository->getVehicleStatusCounts();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getRecentBookings(int $limit = 8): array
    {
        return $this->dashboardRepository->getRecentBookings($limit)->toArray();
    }

    /**
     * @return array{vehicles: array<int, array<string, mixed>>, total: int}
     */
    public function getMaintenanceVehicles(int $limit = 5): array
    {
        return [
            'vehicles' => $this->dashboardRepository->getMaintenanceVehicles($limit)->toArray(),
            'total' => $this->dashboardRepository->getMaintenanceVehicleCount(),
        ];
    }
}
