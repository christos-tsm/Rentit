import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as vehiclesIndex, create as vehiclesCreate } from '@/routes/vehicles';
import type { BreadcrumbItem } from '@/types';
import type { Vehicle, VehicleIndexProps } from '@/types/vehicles';
import { Trash2 } from "lucide-react";

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

export default function VehiclesPage({ vehicles, makes, selectedMakeId }: VehicleIndexProps) {
    function handleMakeFilter(value: string) {
        const makeId = value === 'all' ? undefined : value;
        router.get(vehiclesIndex().url, makeId ? { make_id: makeId } : {}, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-6 py-6 space-y-6">
                <div className="">
                    <div className="flex gap-4 items-end">
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="search">Αναζήτηση</Label>
                            <Input placeholder="Πινακίδες, μάρκα, μοντέλο" name="search" id="search" />
                        </div>
                        <div className="flex flex-col gap-2 w-48">
                            <Label>Μάρκα</Label>
                            <Select
                                value={selectedMakeId ? String(selectedMakeId) : 'all'}
                                onValueChange={handleMakeFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Όλες" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Όλες</SelectItem>
                                    {makes.map((make) => (
                                        <SelectItem key={make.id} value={String(make.id)}>
                                            {make.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild>
                            <Link href={vehiclesCreate().url}>Καταχώρηση οχήματος</Link>
                        </Button>
                    </div>
                </div>
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όχημα</th>
                                <th className="px-4 py-3 text-left font-medium">Κατηγορία</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-left font-medium">Τιμή κατηγορίας/ημέρα</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν οχήματα.
                                    </td>
                                </tr>
                            )}
                            {vehicles.data.map((vehicle: Vehicle) => (
                                <tr key={vehicle.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{vehicle.vehicle_model.make?.name} {vehicle.vehicle_model.name} {vehicle.cc}cc</td>
                                    <td className="px-4 py-3 font-medium">{vehicle.category.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{vehicle.status}</td>
                                    <td className="px-4 py-3">{vehicle.category.base_price_per_day}€</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* <EditCategoryDialog category={category} /> */}
                                            <Button variant="ghost" size="icon" onClick={() => console.log('delete')}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
