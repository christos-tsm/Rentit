import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { store } from '@/actions/App/Http/Controllers/BookingController';
import PriceCalculationController from '@/actions/App/Http/Controllers/PriceCalculationController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { index as bookingsIndex } from '@/routes/bookings';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { Extra, PricingBreakdown, VehicleCategory } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Κρατήσεις', href: bookingsIndex().url },
    { title: 'Νέα κράτηση', href: '#' },
];

type ExtraSelection = { extra_id: number; quantity: number };

type Props = {
    customers: { id: number; first_name: string; last_name: string; email: string }[];
    locations: { id: number; name: string; type: string }[];
    categories: PaginatedResponse<VehicleCategory>;
    extras: Extra[];
};

export default function BookingCreatePage({ customers, locations, categories, extras }: Props) {
    const form = useForm({
        customer_id: '',
        vehicle_id: '',
        vehicle_category_id: '',
        pickup_location_id: '',
        return_location_id: '',
        pickup_date: '',
        return_date: '',
        driver_age: '',
        notes: '',
        extras: [] as ExtraSelection[],
    });

    const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
    const [pricingLoading, setPricingLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchPricing = useCallback(() => {
        if (
            !form.data.vehicle_category_id ||
            !form.data.pickup_date ||
            !form.data.return_date ||
            !form.data.pickup_location_id ||
            !form.data.return_location_id
        ) {
            setPricing(null);
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setPricingLoading(true);

        const body = {
            vehicle_category_id: Number(form.data.vehicle_category_id),
            pickup_date: form.data.pickup_date,
            return_date: form.data.return_date,
            pickup_location_id: Number(form.data.pickup_location_id),
            return_location_id: Number(form.data.return_location_id),
            driver_age: form.data.driver_age ? Number(form.data.driver_age) : null,
            extras: form.data.extras.filter((e) => e.quantity > 0),
        };

        fetch(PriceCalculationController.url(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie
                        .split('; ')
                        .find((c) => c.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1] ?? '',
                ),
                Accept: 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(body),
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error('Price calculation failed');
                return res.json();
            })
            .then((data: PricingBreakdown) => setPricing(data))
            .catch((err) => {
                if (err.name !== 'AbortError') setPricing(null);
            })
            .finally(() => setPricingLoading(false));
    }, [
        form.data.vehicle_category_id,
        form.data.pickup_date,
        form.data.return_date,
        form.data.pickup_location_id,
        form.data.return_location_id,
        form.data.driver_age,
        form.data.extras,
    ]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fetchPricing, 600);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [fetchPricing]);

    function toggleExtra(extraId: number, checked: boolean) {
        if (checked) {
            form.setData('extras', [...form.data.extras, { extra_id: extraId, quantity: 1 }]);
        } else {
            form.setData('extras', form.data.extras.filter((e) => e.extra_id !== extraId));
        }
    }

    function setExtraQuantity(extraId: number, quantity: number) {
        form.setData(
            'extras',
            form.data.extras.map((e) => (e.extra_id === extraId ? { ...e, quantity: Math.max(1, quantity) } : e)),
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(store());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Νέα κράτηση" />
            <div className="px-6 py-6 space-y-6">
                <Heading title="Νέα κράτηση" description="Δημιουργία νέας κράτησης οχήματος." />

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Πελάτης</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer_id">Επιλογή πελάτη</Label>
                                        <Select
                                            value={form.data.customer_id}
                                            onValueChange={(v) => form.setData('customer_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Επιλέξτε πελάτη" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        {c.first_name} {c.last_name} ({c.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={form.errors.customer_id} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Κατηγορία & Όχημα</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_category_id">Κατηγορία οχήματος</Label>
                                        <Select
                                            value={form.data.vehicle_category_id}
                                            onValueChange={(v) => form.setData('vehicle_category_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Επιλέξτε κατηγορία" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.data.map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.name} ({Number(cat.base_price_per_day).toFixed(2)}&euro;/ημέρα)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={form.errors.vehicle_category_id} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_id">ID Οχήματος</Label>
                                        <Input
                                            id="vehicle_id"
                                            type="number"
                                            min="1"
                                            value={form.data.vehicle_id}
                                            onChange={(e) => form.setData('vehicle_id', e.target.value)}
                                            placeholder="Εισάγετε ID οχήματος"
                                        />
                                        <InputError message={form.errors.vehicle_id} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Τοποθεσίες & Ημερομηνίες</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pickup_location_id">Τοποθεσία παραλαβής</Label>
                                            <Select
                                                value={form.data.pickup_location_id}
                                                onValueChange={(v) => form.setData('pickup_location_id', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Επιλέξτε τοποθεσία" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations.map((loc) => (
                                                        <SelectItem key={loc.id} value={String(loc.id)}>
                                                            {loc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={form.errors.pickup_location_id} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="return_location_id">Τοποθεσία παράδοσης</Label>
                                            <Select
                                                value={form.data.return_location_id}
                                                onValueChange={(v) => form.setData('return_location_id', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Επιλέξτε τοποθεσία" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations.map((loc) => (
                                                        <SelectItem key={loc.id} value={String(loc.id)}>
                                                            {loc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={form.errors.return_location_id} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pickup_date">Ημερομηνία παραλαβής</Label>
                                            <Input
                                                id="pickup_date"
                                                type="datetime-local"
                                                value={form.data.pickup_date}
                                                onChange={(e) => form.setData('pickup_date', e.target.value)}
                                            />
                                            <InputError message={form.errors.pickup_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="return_date">Ημερομηνία παράδοσης</Label>
                                            <Input
                                                id="return_date"
                                                type="datetime-local"
                                                value={form.data.return_date}
                                                onChange={(e) => form.setData('return_date', e.target.value)}
                                            />
                                            <InputError message={form.errors.return_date} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Οδηγός</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-w-xs">
                                        <Label htmlFor="driver_age">Ηλικία οδηγού</Label>
                                        <Input
                                            id="driver_age"
                                            type="number"
                                            min="16"
                                            max="100"
                                            value={form.data.driver_age}
                                            onChange={(e) => form.setData('driver_age', e.target.value)}
                                            placeholder="π.χ. 25"
                                        />
                                        <InputError message={form.errors.driver_age} />
                                    </div>
                                </CardContent>
                            </Card>

                            {extras.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Extras</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {extras.map((extra) => {
                                                const selected = form.data.extras.find((e) => e.extra_id === extra.id);
                                                return (
                                                    <div key={extra.id} className="flex items-center gap-4">
                                                        <Checkbox
                                                            id={`extra-${extra.id}`}
                                                            checked={!!selected}
                                                            onCheckedChange={(checked) => toggleExtra(extra.id, !!checked)}
                                                        />
                                                        <Label htmlFor={`extra-${extra.id}`} className="flex-1 cursor-pointer">
                                                            {extra.name}
                                                            <span className="text-muted-foreground ml-2 text-sm">
                                                                ({Number(extra.price_per_day).toFixed(2)}&euro;/{extra.type === 'per_day' ? 'ημέρα' : 'ενοικίαση'})
                                                            </span>
                                                        </Label>
                                                        {selected && (
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                className="w-20"
                                                                value={selected.quantity}
                                                                onChange={(e) => setExtraQuantity(extra.id, Number(e.target.value))}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <InputError message={form.errors.extras} />
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Σημειώσεις</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        placeholder="Προαιρετικές σημειώσεις..."
                                        rows={4}
                                    />
                                    <InputError message={form.errors.notes} />
                                </CardContent>
                            </Card>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Αποθήκευση...' : 'Δημιουργία κράτησης'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={bookingsIndex().url}>Ακύρωση</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Ανάλυση τιμής</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {pricingLoading && (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                            </div>
                                        )}
                                        {!pricingLoading && !pricing && (
                                            <p className="text-sm text-muted-foreground py-4">
                                                Συμπληρώστε κατηγορία, τοποθεσίες και ημερομηνίες για υπολογισμό τιμής.
                                            </p>
                                        )}
                                        {!pricingLoading && pricing && (
                                            <PriceBreakdownPanel breakdown={pricing} />
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function PriceBreakdownPanel({ breakdown }: { breakdown: PricingBreakdown }) {
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
