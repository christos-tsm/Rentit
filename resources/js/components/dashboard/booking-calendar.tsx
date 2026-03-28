import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { show as showBooking } from '@/routes/bookings'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CalendarBooking } from '@/types/dashboard';

const DAY_NAMES = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-blue-500',
    active: 'bg-green-500',
    completed: 'bg-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Εκκρεμεί',
    confirmed: 'Επιβεβαιωμένη',
    active: 'Ενεργή',
    completed: 'Ολοκληρωμένη',
};

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function bookingOverlapsDay(booking: CalendarBooking, day: Date): boolean {
    const pickup = new Date(booking.pickup_date);
    const ret = new Date(booking.return_date);
    pickup.setHours(0, 0, 0, 0);
    ret.setHours(23, 59, 59, 999);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    return pickup <= dayEnd && ret >= dayStart;
}

function vehicleLabel(booking: CalendarBooking): string {
    const v = booking.vehicle;
    if (!v) return '';
    const model = v.vehicle_model;
    const parts = [model?.make?.name, model?.name].filter(Boolean).join(' ');
    return parts ? `${parts} (${v.plate_number})` : v.plate_number;
}

export default function BookingCalendar({ bookings }: { bookings: CalendarBooking[] }) {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = (firstDay.getDay() + 6) % 7;

        const days: (Date | null)[] = [];
        for (let i = 0; i < startOffset; i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));

        return days;
    }, [year, month]);

    const bookingsForDay = useMemo(() => {
        const map = new Map<string, CalendarBooking[]>();
        calendarDays.forEach((day) => {
            if (!day) return;
            const key = day.toISOString().slice(0, 10);
            const dayBookings = bookings.filter((b) => bookingOverlapsDay(b, day));
            if (dayBookings.length > 0) map.set(key, dayBookings);
        });
        return map;
    }, [calendarDays, bookings]);

    const selectedBookings = useMemo(() => {
        if (!selectedDay) return [];
        return bookings.filter((b) => bookingOverlapsDay(b, selectedDay));
    }, [selectedDay, bookings]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthLabel = new Intl.DateTimeFormat('el-GR', { month: 'long', year: 'numeric' }).format(currentDate);

    return (
        <Card className="h-fit min-h-[510px]">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">Ημερολόγιο Κρατήσεων</CardTitle>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="min-w-[140px] text-center text-sm font-medium capitalize">{monthLabel}</span>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="grid grid-cols-7 gap-px flex-1">
                    {DAY_NAMES.map((d) => (
                        <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">
                            {d}
                        </div>
                    ))}
                    {calendarDays.map((day, i) => {
                        if (!day) return <div key={`empty-${i}`} />;
                        const key = day.toISOString().slice(0, 10);
                        const dayBookings = bookingsForDay.get(key) ?? [];
                        const isToday = isSameDay(day, today);
                        const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelectedDay(isSelected ? null : day)}
                                className={`flex border justify-center border-gray-200 flex-col items-center gap-0.5 rounded-md p-1 text-sm transition-colors hover:bg-accent ${isToday ? 'font-medium text-primary border-primary' : ''} ${isSelected ? 'bg-accent' : ''}`}
                            >
                                <span>{day.getDate()}</span>
                                {dayBookings.length > 0 && (
                                    <div className="flex gap-0.5">
                                        {dayBookings.slice(0, 3).map((b) => (
                                            <span key={b.id} className={`size-1.5 rounded-full ${STATUS_COLORS[b.status] ?? 'bg-gray-400'}`} />
                                        ))}
                                        {dayBookings.length > 3 && <span className="text-[9px] leading-none text-muted-foreground">+{dayBookings.length - 3}</span>}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 border-t pt-3">
                    {Object.entries(STATUS_LABELS).map(([status, label]) => (
                        <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className={`size-2 rounded-full ${STATUS_COLORS[status]}`} />
                            {label}
                        </div>
                    ))}
                </div>

                {/* Selected day details */}
                {selectedDay && (
                    <div className="space-y-2 border-t pt-3">
                        <p className="text-sm font-medium">
                            {selectedDay.toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        {selectedBookings.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Δεν υπάρχουν κρατήσεις.</p>
                        ) : (
                            <div className="space-y-1.5">
                                {selectedBookings.map((b) => (
                                    <div key={b.id} className="flex gap-4 items-center justify-between rounded-md border px-3 py-2 text-sm">
                                        <div className="flex gap-2 w-full">
                                            <span className="font-medium">
                                                {b.customer ? `${b.customer.first_name} ${b.customer.last_name}` : `#${b.id}`}
                                            </span>
                                            <span className="ml-2 text-muted-foreground flex-1">{vehicleLabel(b)}</span>
                                            <Badge
                                                variant={
                                                    b.status === 'active' ? 'success' : b.status === 'pending' ? 'secondary' : b.status === 'confirmed' ? 'default' : 'outline'
                                                }
                                                className="text-[10px]"
                                            >
                                                {STATUS_LABELS[b.status] ?? b.status}
                                            </Badge>
                                        </div>
                                        <Link as={"a"} href={showBooking(b.id)} target="_blank" className="text-xs text-primary underline whitespace-nowrap">Δείτε περισσότερα</Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
