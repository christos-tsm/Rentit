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
     * Revenue for 3 months back + current + 3 months ahead.
     *
     * @return array<int, array{month: string, revenue: float}>
     */
    public function getRevenueByMonth(int $pastMonths = 3, int $futureMonths = 3): array
    {
        $now = Carbon::now();
        $data = [];

        for ($i = $pastMonths; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $data[] = [
                'month' => $date->translatedFormat('M Y'),
                'revenue' => round($this->dashboardRepository->getMonthlyRevenue($date->month, $date->year), 2),
            ];
        }

        for ($i = 1; $i <= $futureMonths; $i++) {
            $date = $now->copy()->addMonths($i);
            $data[] = [
                'month' => $date->translatedFormat('M Y'),
                'revenue' => round($this->dashboardRepository->getMonthlyRevenue($date->month, $date->year), 2),
            ];
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
     * @return array<int, array<string, mixed>>
     */
    public function getMaintenanceVehicles(): array
    {
        return $this->dashboardRepository->getActiveMaintenances(Carbon::now())->toArray();
    }
}
