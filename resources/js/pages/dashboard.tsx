import { Head } from '@inertiajs/react';
import BookingCalendar from '@/components/dashboard/booking-calendar';
import MaintenanceList from '@/components/dashboard/maintenance-list';
import RecentBookingsTable from '@/components/dashboard/recent-bookings-table';
import RevenueChart from '@/components/dashboard/revenue-chart';
import VehicleStatusChart from '@/components/dashboard/vehicle-status-chart';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { DashboardProps } from '@/types/dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ calendarBookings, revenueByMonth, vehicleStatusCounts, recentBookings, maintenanceVehicles }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Left column */}
                    <div className="flex flex-col gap-4">
                        <BookingCalendar bookings={calendarBookings} />
                        <RecentBookingsTable bookings={recentBookings} />
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-4">
                        <RevenueChart data={revenueByMonth} />
                        <VehicleStatusChart counts={vehicleStatusCounts} />
                        <MaintenanceList data={maintenanceVehicles} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
