import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { update } from '@/actions/App/Http/Controllers/BookingController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as bookingsIndex } from '@/routes/bookings';
import type { BreadcrumbItem } from '@/types';
import type { Booking, PricingBreakdown } from '@/types/admin';

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

// function formatDate(dateStr: string) {
//     return new Date(dateStr).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
// }

function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function vehicleLabel(vehicle?: Booking['vehicle']) {
    if (!vehicle) return '—';
    const model = vehicle.vehicle_model;
    const parts = [model?.make?.name, model?.name].filter(Boolean).join(' ');
    return parts ? `${parts} - ${vehicle.plate_number}` : vehicle.plate_number;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between py-2 border-b last:border-b-0">
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function BookingShowPage({ booking }: { booking: Booking }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Κρατήσεις', href: bookingsIndex().url },
        { title: `Κράτηση #${booking.id}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Κράτηση #${booking.id}`} />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Heading title={`Κράτηση #${booking.id}`} />
                        {statusBadge(booking.status)}
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={bookingsIndex().url}>Πίσω στις κρατήσεις</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Στοιχεία κράτησης</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DetailRow
                                    label="Πελάτης"
                                    value={
                                        booking.customer
                                            ? `${booking.customer.first_name} ${booking.customer.last_name} (${booking.customer.email})`
                                            : '—'
                                    }
                                />
                                <DetailRow label="Όχημα" value={vehicleLabel(booking.vehicle)} />
                                {booking.vehicle?.category && (
                                    <DetailRow label="Κατηγορία" value={booking.vehicle.category.name} />
                                )}
                                <DetailRow
                                    label="Τοποθεσία παραλαβής"
                                    value={booking.pickup_location?.name ?? '—'}
                                />
                                <DetailRow
                                    label="Ημερομηνία παραλαβής"
                                    value={formatDateTime(booking.pickup_date)}
                                />
                                <DetailRow
                                    label="Τοποθεσία παράδοσης"
                                    value={booking.return_location?.name ?? '—'}
                                />
                                <DetailRow
                                    label="Ημερομηνία παράδοσης"
                                    value={formatDateTime(booking.return_date)}
                                />
                                {booking.driver_age && (
                                    <DetailRow label="Ηλικία οδηγού" value={booking.driver_age} />
                                )}
                                {booking.wp_order_id && (
                                    <DetailRow label="WP Order ID" value={booking.wp_order_id} />
                                )}
                                <DetailRow
                                    label="Συνολικό κόστος"
                                    value={<span className="font-bold">{Number(booking.total_price).toFixed(2)}&euro;</span>}
                                />
                            </CardContent>
                        </Card>

                        {booking.extras && booking.extras.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Extras</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {booking.extras.map((extra) => (
                                        <DetailRow
                                            key={extra.id}
                                            label={`${extra.name} (x${extra.pivot.quantity})`}
                                            value={`${Number(extra.price_per_day).toFixed(2)}\u20AC/${extra.type === 'per_day' ? 'ημέρα' : 'ενοικίαση'}`}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {booking.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Σημειώσεις</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">{booking.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {booking.price_breakdown && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ανάλυση τιμής</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <PriceBreakdownSection breakdown={booking.price_breakdown} />
                                </CardContent>
                            </Card>
                        )}

                        <StatusUpdateCard booking={booking} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatusUpdateCard({ booking }: { booking: Booking }) {
    const form = useForm({ status: booking.status });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(booking.id));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ενημέρωση κατάστασης</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Select
                        value={form.data.status}
                        onValueChange={(v) => form.setData('status', v as Booking['status'])}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full" disabled={form.processing}>
                        Ενημέρωση
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function PriceBreakdownSection({ breakdown }: { breakdown: PricingBreakdown }) {
    const [dailyRatesOpen, setDailyRatesOpen] = useState(false);

    const lines: { label: string; value: number; highlight?: boolean }[] = [
        { label: `Βασικό σύνολο (${breakdown.total_days} ημ.)`, value: breakdown.base_total },
    ];

    if (breakdown.duration_discount !== 0) {
        lines.push({ label: 'Έκπτωση διάρκειας', value: -breakdown.duration_discount });
    }
    if (breakdown.time_adjustment !== 0) {
        lines.push({ label: 'Προσαρμογή χρόνου', value: breakdown.time_adjustment });
    }
    if (breakdown.age_surcharge !== 0) {
        lines.push({ label: 'Προσαύξηση ηλικίας', value: breakdown.age_surcharge });
    }
    if (breakdown.yield_adjustment !== 0) {
        lines.push({ label: 'Προσαρμογή yield', value: breakdown.yield_adjustment });
    }
    if (breakdown.fees_total !== 0) {
        lines.push({ label: 'Τέλη', value: breakdown.fees_total });
    }
    if (breakdown.extras_total !== 0) {
        lines.push({ label: 'Extras', value: breakdown.extras_total });
    }

    lines.push({ label: 'Γενικό σύνολο', value: breakdown.grand_total, highlight: true });

    return (
        <div className="space-y-3">
            {lines.map((line) => (
                <div
                    key={line.label}
                    className={`flex justify-between text-sm ${line.highlight ? 'font-bold text-base border-t pt-3 mt-2' : ''}`}
                >
                    <span>{line.label}</span>
                    <span>{line.value.toFixed(2)}&euro;</span>
                </div>
            ))}

            {Object.keys(breakdown.daily_rates).length > 0 && (
                <div className="border-t pt-3 mt-2">
                    <button
                        type="button"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setDailyRatesOpen(!dailyRatesOpen)}
                    >
                        {dailyRatesOpen ? 'Απόκρυψη' : 'Εμφάνιση'} ημερήσιων τιμών
                    </button>
                    {dailyRatesOpen && (
                        <div className="mt-2 space-y-1">
                            {Object.entries(breakdown.daily_rates).map(([date, rate]) => (
                                <div key={date} className="flex justify-between text-xs text-muted-foreground">
                                    <span>{new Date(date).toLocaleDateString('el-GR')}</span>
                                    <span>{rate.toFixed(2)}&euro;</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {Object.keys(breakdown.fee_details).length > 0 && (
                <div className="border-t pt-3 mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Ανάλυση τελών</p>
                    {Object.entries(breakdown.fee_details).map(([name, amount]) => (
                        <div key={name} className="flex justify-between text-xs text-muted-foreground">
                            <span>{name}</span>
                            <span>{amount.toFixed(2)}&euro;</span>
                        </div>
                    ))}
                </div>
            )}

            {Object.keys(breakdown.extra_details).length > 0 && (
                <div className="border-t pt-3 mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Ανάλυση extras</p>
                    {Object.entries(breakdown.extra_details).map(([name, amount]) => (
                        <div key={name} className="flex justify-between text-xs text-muted-foreground">
                            <span>{name}</span>
                            <span>{amount.toFixed(2)}&euro;</span>
                        </div>
                    ))}
                </div>
            )}

            {breakdown.applied_rules.length > 0 && (
                <div className="border-t pt-3 mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Εφαρμοσμένοι κανόνες</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                        {breakdown.applied_rules.map((rule) => (
                            <li key={rule}>{rule}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
