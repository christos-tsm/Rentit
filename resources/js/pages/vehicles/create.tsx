import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as vehiclesIndex } from '@/routes/vehicles';
import type { BreadcrumbItem } from '@/types';
import type { VehicleCategory, VehicleMake } from '@/types/admin';
import VehicleForm from "@/components/forms/vehicle-form";
import { Head } from "@inertiajs/react";

type Props = {
    makes: VehicleMake[];
    categories: VehicleCategory[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Οχήματα', href: vehiclesIndex().url },
    { title: 'Νέο όχημα', href: '#' },
];

export default function VehicleCreatePage({ makes, categories }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Νέο όχημα" />
            <div className="px-6 py-6 max-w-2xl">
                <Heading title="Νέο όχημα" description="Καταχωρήστε ένα νέο όχημα στο σύστημα." />
                <VehicleForm
                    vehicle={null}
                    makes={makes as VehicleMake[]}
                    categories={categories as VehicleCategory[]}
                />
            </div>
        </AppLayout>
    );
}
