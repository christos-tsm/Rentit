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

export type LocationType = 'airport' | 'office' | 'hotel' | 'port' | 'other';

export type Location = {
    id: number;
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    coordinates?: string;
    operating_hours?: string;
    type: LocationType;
    is_active: boolean;
};

export type Season = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_recurring: boolean;
    priority: number;
    is_active: boolean;
    category_prices?: CategorySeasonPrice[];
};

export type CategorySeasonPrice = {
    id: number;
    vehicle_category_id: number;
    season_id: number;
    daily_rate: number;
};

export type DurationDiscount = {
    id: number;
    name: string;
    min_days: number;
    max_days: number | null;
    discount_percentage: number;
    is_active: boolean;
};

export type BookingTimeAdjustment = {
    id: number;
    name: string;
    type: 'early_bird' | 'last_minute';
    min_days_before: number;
    max_days_before: number | null;
    adjustment_type: 'discount' | 'surcharge';
    percentage: number;
    is_active: boolean;
};

export type DriverAgeSurcharge = {
    id: number;
    name: string;
    min_age: number;
    max_age: number;
    surcharge_type: 'fixed' | 'percentage';
    amount: number;
    is_active: boolean;
};

export type Fee = {
    id: number;
    name: string;
    type: 'fixed' | 'per_day';
    amount: number;
    applies_to: 'all' | 'one_way' | 'airport_pickup' | 'airport_return';
    description?: string;
    is_active: boolean;
};

export type YieldRule = {
    id: number;
    min_available_vehicles: number;
    price_increase_percentage: number;
    is_active: boolean;
};

export type Extra = {
    id: number;
    name: string;
    price_per_day: number;
    type: 'per_day' | 'per_rental';
    description?: string;
    is_active: boolean;
};

export type Customer = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    driver_license_number: string;
    date_of_birth?: string;
    address?: string;
    notes?: string;
    bookings_count?: number;
};

export type Booking = {
    id: number;
    customer_id: number;
    vehicle_id: number;
    pickup_location_id: number;
    return_location_id: number;
    pickup_date: string;
    return_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    wp_order_id?: string;
    driver_age?: number;
    notes?: string;
    price_breakdown?: PricingBreakdown;
    customer?: Customer;
    vehicle?: BookingVehicle;
    pickup_location?: Location;
    return_location?: Location;
    extras?: BookingExtra[];
};

export type BookingVehicle = {
    id: number;
    plate_number: string;
    vehicle_category_id: number;
    vehicle_model?: {
        id: number;
        name: string;
        make?: { id: number; name: string };
    };
    category?: VehicleCategory;
};

export type BookingExtra = Extra & {
    pivot: { quantity: number };
};

export type PricingBreakdown = {
    base_total: number;
    duration_discount: number;
    time_adjustment: number;
    age_surcharge: number;
    yield_adjustment: number;
    fees_total: number;
    extras_total: number;
    grand_total: number;
    total_days: number;
    daily_rates: Record<string, number>;
    applied_rules: string[];
    fee_details: Record<string, number>;
    extra_details: Record<string, number>;
};
