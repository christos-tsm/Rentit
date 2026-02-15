import { Head } from "@inertiajs/react";
import VehicleForm from "@/components/forms/vehicle-form";
import Heading from "@/components/heading";
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as vehiclesIndex } from '@/routes/vehicles';
import type { BreadcrumbItem } from '@/types';
import type { VehicleCategory, VehicleMake } from "@/types/admin";
import type { Vehicle } from '@/types/vehicles';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Οχήματα',
        href: vehiclesIndex().url,
    },
];

export default function VehicleDetailsPage({ vehicle, makes, categories }: { vehicle: Vehicle, makes: VehicleMake[], categories: VehicleCategory[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Επεξεργασία ${vehicle.vehicle_model.make?.name} ${vehicle.vehicle_model.name}`} />
            <div className="px-6 py-6 max-w-2xl">
                <Heading title={`Επεξεργασία ${vehicle.vehicle_model.make?.name} ${vehicle.vehicle_model.name}`} description="Επεξεργασία των πληροφοριών του όχηματος." />
                <VehicleForm
                    vehicle={vehicle}
                    makes={makes as VehicleMake[]}
                    categories={categories as VehicleCategory[]}
                    isEdit
                />
            </div>
        </AppLayout>
    );
}
