import type { Booking } from './admin';
import type { STATUS } from './vehicles';

export type CalendarBooking = Pick<Booking, 'id' | 'pickup_date' | 'return_date' | 'status' | 'total_price'> & {
    customer?: { id: number; first_name: string; last_name: string } | null;
    vehicle?: {
        id: number;
        plate_number: string;
        vehicle_model?: { id: number; name: string; make?: { id: number; name: string } | null } | null;
    } | null;
};

export type RevenueMonth = {
    month: string;
    revenue: number;
};

export type VehicleStatusCounts = Partial<Record<STATUS, number>>;

export type MaintenanceVehicle = {
    id: number;
    vehicle_id: number;
    description: string;
    start_date: string;
    end_date: string | null;
    cost: string;
    vehicle?: {
        id: number;
        plate_number: string;
        status: STATUS;
        vehicle_model?: { id: number; name: string; make?: { id: number; name: string } | null } | null;
    } | null;
};

export type DashboardProps = {
    calendarBookings: CalendarBooking[];
    revenueByMonth: RevenueMonth[];
    vehicleStatusCounts: VehicleStatusCounts;
    recentBookings: Booking[];
    maintenanceVehicles: MaintenanceVehicle[];
};
