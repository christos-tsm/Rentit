<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingTimeAdjustment;
use App\Models\CategorySeasonPrice;
use App\Models\Customer;
use App\Models\DriverAgeSurcharge;
use App\Models\DurationDiscount;
use App\Models\Extra;
use App\Models\Fee;
use App\Models\Location;
use App\Models\Season;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleCategory;
use App\Models\VehicleMake;
use App\Models\VehicleModel;
use App\Models\YieldRule;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin user ──────────────────────────────────────────────
        User::factory()->create([
            'name' => 'Cristos Tsamis',
            'email' => 'christosgsd@gmail.com',
            'password' => Hash::make('password'),
        ]);

        User::factory()->create([
            'name' => 'Demo Admin',
            'email' => 'admin@rentit.test',
            'password' => Hash::make('password'),
        ]);

        // ── Κατηγορίες ─────────────────────────────────────────────
        $categories = collect([
            ['name' => 'Economy', 'slug' => 'economy', 'description' => 'Μικρά, οικονομικά αυτοκίνητα για εύκολη μετακίνηση.', 'base_price_per_day' => 30],
            ['name' => 'Compact', 'slug' => 'compact', 'description' => 'Compact αυτοκίνητα με καλό χώρο αποσκευών.', 'base_price_per_day' => 40],
            ['name' => 'Sedan', 'slug' => 'sedan', 'description' => 'Άνετα sedan για μεγαλύτερες αποστάσεις.', 'base_price_per_day' => 55],
            ['name' => 'SUV', 'slug' => 'suv', 'description' => 'SUV για εξερεύνηση και οικογένειες.', 'base_price_per_day' => 80],
            ['name' => 'Luxury', 'slug' => 'luxury', 'description' => 'Premium οχήματα για πολυτελή εμπειρία.', 'base_price_per_day' => 130],
            ['name' => 'Van', 'slug' => 'van', 'description' => 'Βαν 7-9 θέσεων για μεγάλες παρέες.', 'base_price_per_day' => 90],
            ['name' => 'Cabrio', 'slug' => 'cabrio', 'description' => 'Κάμπριο για απόλαυση της θέας.', 'base_price_per_day' => 95],
        ])->map(fn ($c) => VehicleCategory::create($c));

        // ── Μάρκες & Μοντέλα ────────────────────────────────────────
        $makesData = [
            'Toyota' => ['Yaris', 'Corolla', 'C-HR', 'RAV4', 'Aygo X'],
            'Hyundai' => ['i10', 'i20', 'i30', 'Tucson', 'Kona'],
            'Volkswagen' => ['Polo', 'Golf', 'T-Roc', 'Tiguan', 'Passat'],
            'Nissan' => ['Micra', 'Qashqai', 'Juke', 'X-Trail'],
            'Fiat' => ['Panda', '500', 'Tipo'],
            'Renault' => ['Clio', 'Captur', 'Megane', 'Kadjar'],
            'Suzuki' => ['Swift', 'Vitara', 'Jimny', 'S-Cross'],
            'Ford' => ['Fiesta', 'Focus', 'Puma', 'Kuga'],
            'BMW' => ['Series 3', 'X1', 'X3', 'Series 1'],
            'Mercedes-Benz' => ['A-Class', 'C-Class', 'GLA', 'CLA'],
        ];

        $models = collect();
        foreach ($makesData as $makeName => $modelNames) {
            $make = VehicleMake::create(['name' => $makeName]);
            foreach ($modelNames as $modelName) {
                $models->push(VehicleModel::create([
                    'vehicle_make_id' => $make->id,
                    'name' => $modelName,
                ]));
            }
        }

        // ── Mapping μοντέλων σε κατηγορίες ──────────────────────────
        $categoryMap = [
            'Economy' => ['Yaris', 'i10', 'Polo', 'Micra', 'Panda', '500', 'Clio', 'Swift', 'Fiesta', 'Aygo X'],
            'Compact' => ['i20', 'Golf', 'Tipo', 'Captur', 'Vitara', 'Juke', 'Focus', 'Series 1'],
            'Sedan' => ['Corolla', 'i30', 'Passat', 'Megane', 'A-Class'],
            'SUV' => ['C-HR', 'RAV4', 'Tucson', 'T-Roc', 'Tiguan', 'Qashqai', 'X-Trail', 'Kadjar', 'S-Cross', 'Puma', 'Kuga', 'X1', 'GLA', 'Kona'],
            'Luxury' => ['Series 3', 'X3', 'C-Class', 'CLA'],
            'Van' => [],
            'Cabrio' => ['Jimny'],
        ];

        $greekPlates = fn () => strtoupper(fake()->randomLetter().fake()->randomLetter().fake()->randomLetter()).'-'.fake()->numberBetween(1000, 9999);

        foreach ($categories as $category) {
            $modelNames = $categoryMap[$category->name] ?? [];
            $assignedModels = $models->filter(fn ($m) => in_array($m->name, $modelNames));

            if ($assignedModels->isEmpty()) {
                continue;
            }

            $vehicleCount = match ($category->name) {
                'Economy' => 8,
                'Compact' => 6,
                'Sedan' => 4,
                'SUV' => 7,
                'Luxury' => 3,
                'Cabrio' => 2,
                default => 2,
            };

            for ($i = 0; $i < $vehicleCount; $i++) {
                $model = $assignedModels->random();
                Vehicle::create([
                    'vehicle_category_id' => $category->id,
                    'vehicle_model_id' => $model->id,
                    'plate_number' => $greekPlates(),
                    'cc' => fake()->randomElement([999, 1000, 1200, 1400, 1500, 1600, 1800, 2000, 2500]),
                    'seats' => $category->name === 'Van' ? 9 : fake()->randomElement([4, 5]),
                    'large_bags_capacity' => fake()->numberBetween(1, 3),
                    'small_bags_capacity' => fake()->numberBetween(1, 3),
                    'doors' => fake()->randomElement([3, 5]),
                    'ac' => true,
                    'gears' => fake()->randomElement([5, 6]),
                    'hp' => fake()->numberBetween(70, 250),
                    'base_price' => $category->base_price_per_day,
                    'fuel_type' => fake()->randomElement(['petrol', 'diesel', 'hybrid']),
                    'transmission' => fake()->randomElement(['manual', 'automatic']),
                    'status' => fake()->randomElement(['available', 'available', 'available', 'rented', 'maintenance']),
                    'current_km' => fake()->numberBetween(5000, 120000),
                ]);
            }
        }

        // ── Τοποθεσίες ─────────────────────────────────────────────
        $locations = collect([
            ['name' => 'Αεροδρόμιο Ηρακλείου "Ν. Καζαντζάκης"', 'address' => 'Λεωφ. Ικάρου, Ηράκλειο 716 01', 'type' => 'airport', 'phone' => '+30 2810 397800', 'email' => 'heraklion@rentit.gr', 'operating_hours' => '06:00-23:00', 'is_active' => true],
            ['name' => 'Αεροδρόμιο Χανίων "Ι. Δασκαλογιάννης"', 'address' => 'Ακρωτήρι, Χανιά 731 00', 'type' => 'airport', 'phone' => '+30 28210 83800', 'email' => 'chania@rentit.gr', 'operating_hours' => '06:00-23:00', 'is_active' => true],
            ['name' => 'Γραφείο Ηρακλείου - Κέντρο', 'address' => 'Λεωφ. 62 Μαρτύρων 42, Ηράκλειο 712 02', 'type' => 'office', 'phone' => '+30 2810 223456', 'email' => 'office-heraklion@rentit.gr', 'operating_hours' => '08:00-20:00', 'is_active' => true],
            ['name' => 'Γραφείο Ρεθύμνου', 'address' => 'Κουντουριώτη 15, Ρέθυμνο 741 00', 'type' => 'office', 'phone' => '+30 28310 54321', 'email' => 'rethymno@rentit.gr', 'operating_hours' => '08:00-20:00', 'is_active' => true],
            ['name' => 'Γραφείο Αγίου Νικολάου', 'address' => 'Ακτή Κουνδούρου 8, Άγιος Νικόλαος 721 00', 'type' => 'office', 'phone' => '+30 28410 22345', 'email' => 'agios-nikolaos@rentit.gr', 'operating_hours' => '09:00-19:00', 'is_active' => true],
            ['name' => 'Ξενοδοχείο Creta Maris', 'address' => 'Χερσόνησος 700 14', 'type' => 'hotel', 'phone' => '+30 28970 27000', 'email' => 'cretamaris@rentit.gr', 'operating_hours' => '08:00-20:00', 'is_active' => true],
            ['name' => 'Λιμάνι Ηρακλείου', 'address' => 'Λιμένας Ηρακλείου, 712 02', 'type' => 'port', 'phone' => '+30 2810 244912', 'email' => 'port@rentit.gr', 'operating_hours' => '06:00-22:00', 'is_active' => true],
        ])->map(fn ($l) => Location::create($l));

        // ── Σεζόν ───────────────────────────────────────────────────
        $lowSeason = Season::create([
            'name' => 'Low Season',
            'start_date' => '2000-11-01',
            'end_date' => '2000-03-31',
            'is_recurring' => true,
            'priority' => 0,
            'is_active' => true,
        ]);

        $midSeason = Season::create([
            'name' => 'Mid Season',
            'start_date' => '2000-04-01',
            'end_date' => '2000-05-31',
            'is_recurring' => true,
            'priority' => 1,
            'is_active' => true,
        ]);

        $highSeason = Season::create([
            'name' => 'High Season',
            'start_date' => '2000-06-01',
            'end_date' => '2000-09-30',
            'is_recurring' => true,
            'priority' => 2,
            'is_active' => true,
        ]);

        $shoulderSeason = Season::create([
            'name' => 'Shoulder Season',
            'start_date' => '2000-10-01',
            'end_date' => '2000-10-31',
            'is_recurring' => true,
            'priority' => 1,
            'is_active' => true,
        ]);

        $peakJuly2026 = Season::create([
            'name' => 'Peak Ιούλιος 2026',
            'start_date' => '2026-07-15',
            'end_date' => '2026-08-31',
            'is_recurring' => false,
            'priority' => 10,
            'is_active' => true,
        ]);

        // ── Τιμές ανά κατηγορία/σεζόν ──────────────────────────────
        $priceMatrix = [
            //                    Low  Mid  High  Shoulder  Peak2026
            'Economy' => [22, 30, 45, 28, 55],
            'Compact' => [28, 38, 55, 35, 70],
            'Sedan' => [38, 50, 72, 45, 90],
            'SUV' => [50, 68, 95, 60, 120],
            'Luxury' => [85, 110, 155, 100, 200],
            'Van' => [60, 78, 110, 70, 140],
            'Cabrio' => [55, 75, 110, 65, 135],
        ];

        $seasonOrder = [$lowSeason, $midSeason, $highSeason, $shoulderSeason, $peakJuly2026];

        foreach ($categories as $category) {
            $prices = $priceMatrix[$category->name] ?? null;
            if (! $prices) {
                continue;
            }
            foreach ($seasonOrder as $i => $season) {
                CategorySeasonPrice::create([
                    'vehicle_category_id' => $category->id,
                    'season_id' => $season->id,
                    'daily_rate' => $prices[$i],
                ]);
            }
        }

        // ── Εκπτώσεις διάρκειας ────────────────────────────────────
        DurationDiscount::create(['name' => 'Κανονική τιμή (1-3 ημ.)', 'min_days' => 1, 'max_days' => 3, 'discount_percentage' => 0, 'is_active' => true]);
        DurationDiscount::create(['name' => 'Εβδομαδιαία (4-7 ημ.)', 'min_days' => 4, 'max_days' => 7, 'discount_percentage' => 10, 'is_active' => true]);
        DurationDiscount::create(['name' => 'Μακροχρόνια (8-14 ημ.)', 'min_days' => 8, 'max_days' => 14, 'discount_percentage' => 18, 'is_active' => true]);
        DurationDiscount::create(['name' => 'Μηνιαία (15+ ημ.)', 'min_days' => 15, 'max_days' => null, 'discount_percentage' => 25, 'is_active' => true]);

        // ── Early Bird / Last Minute ────────────────────────────────
        BookingTimeAdjustment::create([
            'name' => 'Early Bird 3+ μήνες',
            'type' => 'early_bird',
            'min_days_before' => 90,
            'max_days_before' => null,
            'adjustment_type' => 'discount',
            'percentage' => 12,
            'is_active' => true,
        ]);
        BookingTimeAdjustment::create([
            'name' => 'Early Bird 2 μήνες',
            'type' => 'early_bird',
            'min_days_before' => 60,
            'max_days_before' => 89,
            'adjustment_type' => 'discount',
            'percentage' => 7,
            'is_active' => true,
        ]);
        BookingTimeAdjustment::create([
            'name' => 'Last Minute',
            'type' => 'last_minute',
            'min_days_before' => 0,
            'max_days_before' => 2,
            'adjustment_type' => 'surcharge',
            'percentage' => 15,
            'is_active' => true,
        ]);

        // ── Χρεώσεις ηλικίας ────────────────────────────────────────
        DriverAgeSurcharge::create(['name' => 'Νεαρός οδηγός (18-21)', 'min_age' => 18, 'max_age' => 21, 'surcharge_type' => 'fixed', 'amount' => 35, 'is_active' => true]);
        DriverAgeSurcharge::create(['name' => 'Νεαρός οδηγός (22-25)', 'min_age' => 22, 'max_age' => 25, 'surcharge_type' => 'fixed', 'amount' => 15, 'is_active' => true]);
        DriverAgeSurcharge::create(['name' => 'Ηλικιωμένος οδηγός (70+)', 'min_age' => 70, 'max_age' => 99, 'surcharge_type' => 'percentage', 'amount' => 12, 'is_active' => true]);

        // ── Τέλη ────────────────────────────────────────────────────
        Fee::create(['name' => 'Βασική ασφάλεια (CDW)', 'type' => 'per_day', 'amount' => 8, 'applies_to' => 'all', 'description' => 'Ασφάλεια πρόσκρουσης με απαλλαγή', 'is_active' => true]);
        Fee::create(['name' => 'Τέλος παραλαβής αεροδρομίου', 'type' => 'fixed', 'amount' => 25, 'applies_to' => 'airport_pickup', 'description' => 'Εξυπηρέτηση στο αεροδρόμιο', 'is_active' => true]);
        Fee::create(['name' => 'Τέλος παράδοσης αεροδρομίου', 'type' => 'fixed', 'amount' => 15, 'applies_to' => 'airport_return', 'description' => 'Παράδοση στο αεροδρόμιο', 'is_active' => true]);
        Fee::create(['name' => 'One-way fee', 'type' => 'fixed', 'amount' => 50, 'applies_to' => 'one_way', 'description' => 'Παράδοση σε διαφορετική τοποθεσία', 'is_active' => true]);

        // ── Yield Rules ─────────────────────────────────────────────
        YieldRule::create(['min_available_vehicles' => 2, 'price_increase_percentage' => 20, 'is_active' => true]);
        YieldRule::create(['min_available_vehicles' => 4, 'price_increase_percentage' => 10, 'is_active' => true]);

        // ── Extras ──────────────────────────────────────────────────
        Extra::create(['name' => 'GPS Navigator', 'price_per_day' => 5, 'type' => 'per_day', 'description' => 'Garmin GPS με χάρτες Ελλάδας', 'is_active' => true]);
        Extra::create(['name' => 'Παιδικό κάθισμα (0-13 kg)', 'price_per_day' => 4, 'type' => 'per_day', 'description' => 'Βρεφικό κάθισμα ασφαλείας', 'is_active' => true]);
        Extra::create(['name' => 'Παιδικό κάθισμα (9-36 kg)', 'price_per_day' => 4, 'type' => 'per_day', 'description' => 'Παιδικό booster κάθισμα', 'is_active' => true]);
        Extra::create(['name' => 'Πρόσθετος οδηγός', 'price_per_day' => 5, 'type' => 'per_day', 'description' => 'Κάλυψη πρόσθετου οδηγού', 'is_active' => true]);
        Extra::create(['name' => 'Full Insurance (SCDW)', 'price_per_day' => 12, 'type' => 'per_day', 'description' => 'Μηδενική απαλλαγή, πλήρης κάλυψη', 'is_active' => true]);
        Extra::create(['name' => 'WiFi Hotspot', 'price_per_day' => 6, 'type' => 'per_day', 'description' => 'Φορητό WiFi 4G', 'is_active' => true]);
        Extra::create(['name' => 'Αλυσίδες χιονιού', 'price_per_day' => 0, 'type' => 'per_rental', 'description' => 'Αλυσίδες χιονιού (χειμερινή περίοδος)', 'is_active' => false]);

        // ── Πελάτες ─────────────────────────────────────────────────
        $customers = collect([
            ['first_name' => 'Γιώργος', 'last_name' => 'Παπαδόπουλος', 'email' => 'g.papadopoulos@example.com', 'phone' => '+30 694 123 4567', 'driver_license_number' => 'ΑΒ-123456', 'date_of_birth' => '1985-03-15', 'address' => 'Κηφισίας 42, Αθήνα 115 26'],
            ['first_name' => 'Μαρία', 'last_name' => 'Αντωνίου', 'email' => 'm.antoniou@example.com', 'phone' => '+30 697 234 5678', 'driver_license_number' => 'ΓΔ-789012', 'date_of_birth' => '1990-07-22', 'address' => 'Τσιμισκή 18, Θεσσαλονίκη 546 24'],
            ['first_name' => 'Νίκος', 'last_name' => 'Κωνσταντίνου', 'email' => 'n.konstantinou@example.com', 'phone' => '+30 693 345 6789', 'driver_license_number' => 'ΕΖ-345678', 'date_of_birth' => '1978-11-08', 'address' => 'Λ. Εθνικής Αντιστάσεως 71, Ηράκλειο 713 06'],
            ['first_name' => 'Anna', 'last_name' => 'Schmidt', 'email' => 'anna.schmidt@example.de', 'phone' => '+49 170 1234567', 'driver_license_number' => 'DE-B4567890', 'date_of_birth' => '1992-04-12', 'address' => 'Berliner Str. 15, München'],
            ['first_name' => 'Thomas', 'last_name' => 'Müller', 'email' => 'thomas.mueller@example.de', 'phone' => '+49 171 9876543', 'driver_license_number' => 'DE-M7654321', 'date_of_birth' => '1988-01-30', 'address' => 'Hauptstr. 8, Hamburg'],
            ['first_name' => 'Emma', 'last_name' => 'Johnson', 'email' => 'emma.j@example.co.uk', 'phone' => '+44 7700 900456', 'driver_license_number' => 'UK-JOHNS906155', 'date_of_birth' => '1995-09-18', 'address' => '42 Kings Road, London SW3'],
            ['first_name' => 'Pierre', 'last_name' => 'Dubois', 'email' => 'p.dubois@example.fr', 'phone' => '+33 6 12 34 56 78', 'driver_license_number' => 'FR-0512345678', 'date_of_birth' => '1983-06-25', 'address' => '14 Rue de Rivoli, Paris 75001'],
            ['first_name' => 'Δημήτρης', 'last_name' => 'Βασιλείου', 'email' => 'd.vasileiou@example.com', 'phone' => '+30 698 456 7890', 'driver_license_number' => 'ΗΘ-901234', 'date_of_birth' => '2002-12-05', 'address' => 'Πατησίων 76, Αθήνα 104 34'],
            ['first_name' => 'Ελένη', 'last_name' => 'Μαρκοπούλου', 'email' => 'e.markopoulou@example.com', 'phone' => '+30 695 567 8901', 'driver_license_number' => 'ΙΚ-567890', 'date_of_birth' => '1970-02-28', 'address' => 'Βενιζέλου 23, Χανιά 731 00'],
            ['first_name' => 'Αλέξανδρος', 'last_name' => 'Νικολαΐδης', 'email' => 'a.nikolaidis@example.com', 'phone' => '+30 691 678 9012', 'driver_license_number' => 'ΛΜ-234567', 'date_of_birth' => '1955-08-14', 'address' => 'Εγνατία 150, Θεσσαλονίκη 546 36'],
        ])->map(fn ($c) => Customer::create($c));

        // ── Κρατήσεις (ρεαλιστικά σενάρια) ──────────────────────────
        $vehicles = Vehicle::where('status', 'available')->get();
        $airportHer = $locations->firstWhere('type', 'airport');
        $officeHer = $locations->firstWhere('name', 'Γραφείο Ηρακλείου - Κέντρο');
        $airportCh = $locations->where('type', 'airport')->last();
        $hotel = $locations->firstWhere('type', 'hotel');

        $bookingsData = [
            ['customer' => 0, 'days' => 7, 'pickup' => '2026-06-15 10:00', 'from' => $airportHer, 'to' => $airportHer, 'status' => 'completed'],
            ['customer' => 1, 'days' => 4, 'pickup' => '2026-07-20 14:00', 'from' => $airportCh, 'to' => $airportCh, 'status' => 'confirmed'],
            ['customer' => 2, 'days' => 14, 'pickup' => '2026-08-01 09:00', 'from' => $airportHer, 'to' => $officeHer, 'status' => 'confirmed'],
            ['customer' => 3, 'days' => 10, 'pickup' => '2026-07-05 12:00', 'from' => $airportHer, 'to' => $airportHer, 'status' => 'active'],
            ['customer' => 4, 'days' => 5, 'pickup' => '2026-09-10 11:00', 'from' => $officeHer, 'to' => $officeHer, 'status' => 'pending'],
            ['customer' => 5, 'days' => 21, 'pickup' => '2026-06-01 10:00', 'from' => $airportHer, 'to' => $airportCh, 'status' => 'completed'],
            ['customer' => 6, 'days' => 3, 'pickup' => '2026-08-20 16:00', 'from' => $hotel, 'to' => $airportHer, 'status' => 'pending'],
            ['customer' => 7, 'days' => 2, 'pickup' => '2026-10-05 09:00', 'from' => $officeHer, 'to' => $officeHer, 'status' => 'pending'],
            ['customer' => 8, 'days' => 12, 'pickup' => '2026-05-15 10:00', 'from' => $airportHer, 'to' => $airportHer, 'status' => 'completed'],
            ['customer' => 9, 'days' => 6, 'pickup' => '2026-04-20 08:00', 'from' => $officeHer, 'to' => $officeHer, 'status' => 'cancelled'],
        ];

        foreach ($bookingsData as $bd) {
            $customer = $customers[$bd['customer']];
            $vehicle = $vehicles->random();
            $pickup = Carbon::parse($bd['pickup']);
            $return = $pickup->copy()->addDays($bd['days']);

            Booking::create([
                'customer_id' => $customer->id,
                'vehicle_id' => $vehicle->id,
                'pickup_location_id' => $bd['from']->id,
                'return_location_id' => $bd['to']->id,
                'pickup_date' => $pickup,
                'return_date' => $return,
                'total_price' => fake()->randomFloat(2, 150, 2500),
                'status' => $bd['status'],
                'driver_age' => Carbon::parse($customer->date_of_birth)->age,
                'notes' => fake()->optional(0.3)->sentence(),
            ]);
        }
    }
}
