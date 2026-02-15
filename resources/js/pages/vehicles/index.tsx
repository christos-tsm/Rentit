import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2 } from "lucide-react";
import { useRef, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
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
import { VEHICLE_STATUSES } from "@/lib/vehicle-constants";
import { dashboard } from '@/routes';
import { index as vehiclesIndex, create as vehiclesCreate, show as vehiclesShow } from '@/routes/vehicles';
import type { BreadcrumbItem } from '@/types';
import type { Vehicle, VehicleIndexProps } from '@/types/vehicles';

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

export default function VehiclesPage({ vehicles, makes, categories, filters }: VehicleIndexProps) {
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = useCallback((updated: Record<string, string | undefined>) => {
        const params: Record<string, string> = {};

        const merged = {
            search: filters.search ?? undefined,
            make_id: filters.make_id ? String(filters.make_id) : undefined,
            category_id: filters.category_id ? String(filters.category_id) : undefined,
            status: filters.status ?? undefined,
            ...updated,
        };

        for (const [key, value] of Object.entries(merged)) {
            if (value && value !== 'all') {
                params[key] = value;
            }
        }

        router.get(vehiclesIndex().url, params, { preserveState: true });
    }, [filters]);

    function handleSearch(value: string) {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            applyFilters({ search: value || undefined });
        }, 500);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Οχήματα" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex gap-4 items-end flex-wrap">
                    <div className="flex flex-col gap-2 flex-1 min-w-48">
                        <Label htmlFor="search">Αναζήτηση</Label>
                        <Input
                            placeholder="Πινακίδα, VIN"
                            name="search"
                            id="search"
                            defaultValue={filters.search ?? ''}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-44">
                        <Label>Μάρκα</Label>
                        <Select
                            value={filters.make_id ? String(filters.make_id) : 'all'}
                            onValueChange={(v) => applyFilters({ make_id: v === 'all' ? undefined : v })}
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
                    <div className="flex flex-col gap-2 w-44">
                        <Label>Κατηγορία</Label>
                        <Select
                            value={filters.category_id ? String(filters.category_id) : 'all'}
                            onValueChange={(v) => applyFilters({ category_id: v === 'all' ? undefined : v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Όλες" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Όλες</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2 w-44">
                        <Label>Κατάσταση</Label>
                        <Select
                            value={filters.status ?? 'all'}
                            onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Όλες" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Όλες</SelectItem>
                                {VEHICLE_STATUSES.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button asChild>
                        <Link href={vehiclesCreate().url}>Καταχώρηση οχήματος</Link>
                    </Button>
                </div>
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όχημα</th>
                                <th className="px-4 py-3 text-left font-medium">Αρ. Κυκλοφορίας</th>
                                <th className="px-4 py-3 text-left font-medium">Αρ. πλαισίου / VIN</th>
                                <th className="px-4 py-3 text-left font-medium">Κατηγορία</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-left font-medium">Τιμή κατηγορίας/ημέρα</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν οχήματα.
                                    </td>
                                </tr>
                            )}
                            {vehicles.data.map((vehicle: Vehicle) => (
                                <tr key={vehicle.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{vehicle.vehicle_model.make?.name} {vehicle.vehicle_model.name} {vehicle.cc}cc</td>
                                    <td className="px-4 py-3 font-medium">{vehicle.plate_number}</td>
                                    <td className="px-4 py-3 font-medium">{vehicle.vin || '-'}</td>
                                    <td className="px-4 py-3 font-medium">{vehicle.category.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        <Badge variant={vehicle.status === 'available' ? 'success' : 'destructive'}>
                                            {VEHICLE_STATUSES.find((status) => status.value === vehicle.status)?.label}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">{vehicle.category.base_price_per_day}€</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={vehiclesShow(vehicle.id).url}>
                                                <Eye className="size-5" />
                                            </Link>
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
