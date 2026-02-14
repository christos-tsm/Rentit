export type VehicleMake = {
    id: number;
    name: string;
    vehicle_models_count?: number;
};

export type VehicleModel = {
    id: number;
    vehicle_make_id: number;
    name: string;
    vehicles_count?: number;
    make?: VehicleMake;
};

export type VehicleCategory = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    base_price_per_day: number;
    vehicles_count?: number;
};
