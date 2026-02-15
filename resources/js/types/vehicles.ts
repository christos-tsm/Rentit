import { PaginatedResponse } from '.';
import type { VehicleCategory, VehicleMake, VehicleModel } from './admin';

type FUEL_TYPE = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type STATUS = 'available' | 'rented' | 'maintenance' | 'out_of_service';
type TRANSMISSION = 'manual' | 'automatic';

export type Vehicle = {
    id: number;
    vehicle_model_id: number;
    vehicle_category_id: number;
    category: VehicleCategory;
    plate_number: string;
    cc: number;
    seats: number;
    large_bags_capacity: number;
    small_bags_capacity: number;
    doors: number;
    ac: boolean;
    gears: number;
    hp: number;
    base_price: number;
    vin?: string;
    fuel_type: FUEL_TYPE;
    transmission: TRANSMISSION;
    status: STATUS;
    current_km: number;
    image_path?: string;
    vehicle_model: VehicleModel;
};

export type VehiclePageData = PaginatedResponse<Vehicle>;

export type VehicleIndexFilters = {
    search: string | null;
    make_id: number | null;
    category_id: number | null;
    status: STATUS | null;
};

export type VehicleIndexProps = {
    vehicles: VehiclePageData;
    makes: VehicleMake[];
    categories: VehicleCategory[];
    filters: VehicleIndexFilters;
};
