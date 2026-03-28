import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { show as bookingsShow } from '@/routes/bookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Booking } from '@/types/admin';

const STATUS_MAP: Record<Booking['status'], { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'outline' }> = {
    pending: { label: 'Εκκρεμεί', variant: 'secondary' },
    confirmed: { label: 'Επιβεβαιωμένη', variant: 'default' },
    active: { label: 'Ενεργή', variant: 'success' },
    completed: { label: 'Ολοκληρωμένη', variant: 'outline' },
    cancelled: { label: 'Ακυρωμένη', variant: 'destructive' },
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function vehicleLabel(vehicle?: Booking['vehicle']): string {
    if (!vehicle) return '—';
    const model = vehicle.vehicle_model;
    const parts = [model?.make?.name, model?.name].filter(Boolean).join(' ');
    return parts || vehicle.plate_number;
}

export default function RecentBookingsTable({ bookings }: { bookings: Booking[] }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Πρόσφατες Κρατήσεις</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-2 text-left font-medium">#</th>
                                <th className="px-4 py-2 text-left font-medium">Πελάτης</th>
                                <th className="px-4 py-2 text-left font-medium">Όχημα</th>
                                <th className="px-4 py-2 text-left font-medium">Ημ/νίες</th>
                                <th className="px-4 py-2 text-left font-medium">Σύνολο</th>
                                <th className="px-4 py-2 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-2 text-right font-medium" />
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                                        Δεν υπάρχουν κρατήσεις.
                                    </td>
                                </tr>
                            )}
                            {bookings.map((b) => {
                                const s = STATUS_MAP[b.status];
                                return (
                                    <tr key={b.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                        <td className="px-4 py-2.5 font-medium">{b.id}</td>
                                        <td className="px-4 py-2.5">
                                            {b.customer ? `${b.customer.first_name} ${b.customer.last_name}` : '—'}
                                        </td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{vehicleLabel(b.vehicle)}</td>
                                        <td className="px-4 py-2.5 tabular-nums">
                                            {formatDate(b.pickup_date)} – {formatDate(b.return_date)}
                                        </td>
                                        <td className="px-4 py-2.5 font-medium tabular-nums">{parseFloat(b.total_price).toFixed(2)}&euro;</td>
                                        <td className="px-4 py-2.5">
                                            <Badge variant={s.variant} className="text-[10px]">
                                                {s.label}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <Button variant="ghost" size="icon" className="size-7" asChild>
                                                <Link href={bookingsShow(b.id).url}>
                                                    <Eye className="size-3.5" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
