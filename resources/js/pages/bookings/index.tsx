import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { destroy } from '@/actions/App/Http/Controllers/BookingController';
import Heading from '@/components/heading';
import TablePagination from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { index as bookingsIndex, create as bookingsCreate, show as bookingsShow } from '@/routes/bookings';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { Booking } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Κρατήσεις', href: bookingsIndex().url },
];

const STATUS_OPTIONS: { value: Booking['status']; label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'outline' }[] = [
    { value: 'pending', label: 'Εκκρεμεί', variant: 'secondary' },
    { value: 'confirmed', label: 'Επιβεβαιωμένη', variant: 'default' },
    { value: 'active', label: 'Ενεργή', variant: 'success' },
    { value: 'completed', label: 'Ολοκληρωμένη', variant: 'outline' },
    { value: 'cancelled', label: 'Ακυρωμένη', variant: 'destructive' },
];

function statusBadge(status: Booking['status']) {
    const opt = STATUS_OPTIONS.find((s) => s.value === status);
    return <Badge variant={opt?.variant ?? 'default'}>{opt?.label ?? status}</Badge>;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function vehicleLabel(vehicle?: Booking['vehicle']) {
    if (!vehicle) return '—';
    const model = vehicle.vehicle_model;
    const parts = [model?.make?.name, model?.name].filter(Boolean).join(' ');
    return parts ? `${parts} - ${vehicle.plate_number}` : vehicle.plate_number;
}

export default function BookingsPage({
    bookings,
    filters,
}: {
    bookings: PaginatedResponse<Booking>;
    filters: { status?: string; customer_id?: string };
}) {
    function applyStatusFilter(value: string) {
        const params: Record<string, string> = {};
        if (value && value !== 'all') params.status = value;
        if (filters.customer_id) params.customer_id = filters.customer_id;
        router.get(bookingsIndex().url, params, { preserveState: true });
    }

    function handleDelete(booking: Booking) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε την κράτηση #${booking.id};`)) return;
        router.delete(destroy(booking.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Κρατήσεις" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Κρατήσεις" description="Διαχείριση κρατήσεων οχημάτων." />
                    <Button asChild>
                        <Link href={bookingsCreate().url}>
                            <Plus className="size-4 mr-1" />
                            Νέα κράτηση
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-4 items-end flex-wrap">
                    <div className="flex flex-col gap-2 w-48">
                        <Label>Κατάσταση</Label>
                        <Select
                            value={filters.status ?? 'all'}
                            onValueChange={applyStatusFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Όλες" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Όλες</SelectItem>
                                {STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">#ID</th>
                                <th className="px-4 py-3 text-left font-medium">Πελάτης</th>
                                <th className="px-4 py-3 text-left font-medium">Όχημα</th>
                                <th className="px-4 py-3 text-left font-medium">Παραλαβή</th>
                                <th className="px-4 py-3 text-left font-medium">Παράδοση</th>
                                <th className="px-4 py-3 text-left font-medium">Σύνολο</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν κρατήσεις.
                                    </td>
                                </tr>
                            )}
                            {bookings.data.map((booking) => (
                                <tr key={booking.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">#{booking.id}</td>
                                    <td className="px-4 py-3">
                                        {booking.customer
                                            ? `${booking.customer.first_name} ${booking.customer.last_name}`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {vehicleLabel(booking.vehicle)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>{formatDate(booking.pickup_date)}</div>
                                        <div className="text-xs text-muted-foreground">{booking.pickup_location?.name}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>{formatDate(booking.return_date)}</div>
                                        <div className="text-xs text-muted-foreground">{booking.return_location?.name}</div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{booking.total_price.toFixed(2)}&euro;</td>
                                    <td className="px-4 py-3">{statusBadge(booking.status)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={bookingsShow(booking.id).url}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(booking)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <TablePagination pagination={bookings} />
                </div>
            </div>
        </AppLayout>
    );
}
