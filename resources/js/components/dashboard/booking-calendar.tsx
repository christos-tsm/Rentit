import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { show as showBooking } from '@/routes/bookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CalendarBooking } from '@/types/dashboard';

const DAY_NAMES = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];
const MAX_LANES = 3;

const STATUS_BAR: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-200/80 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
    confirmed: { bg: 'bg-blue-200/80 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
    active: { bg: 'bg-green-200/80 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
    completed: { bg: 'bg-gray-200/80 dark:bg-gray-700/50', text: 'text-gray-600 dark:text-gray-300' },
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Εκκρεμεί',
    confirmed: 'Επιβεβαιωμένη',
    active: 'Ενεργή',
    completed: 'Ολοκληρωμένη',
};

function toDateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfDay(d: Date): Date {
    const r = new Date(d);
    r.setHours(0, 0, 0, 0);
    return r;
}

function customerName(b: CalendarBooking): string {
    if (!b.customer) return `#${b.id}`;
    return `${b.customer.first_name} ${b.customer.last_name}`;
}

function vehicleLabel(b: CalendarBooking): string {
    const v = b.vehicle;
    if (!v) return '';
    const model = v.vehicle_model;
    return [model?.make?.name, model?.name].filter(Boolean).join(' ');
}

type Segment = {
    booking: CalendarBooking;
    startCol: number;
    endCol: number;
    lane: number;
};

type WeekData = {
    days: (Date | null)[];
    segments: Segment[];
    overflow: number;
};

function buildWeeks(calendarDays: (Date | null)[], bookings: CalendarBooking[]): WeekData[] {
    const weeks: WeekData[] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push({ days: calendarDays.slice(i, i + 7), segments: [], overflow: 0 });
    }

    const parsed = bookings.map((b) => ({
        booking: b,
        start: startOfDay(new Date(b.pickup_date)),
        end: startOfDay(new Date(b.return_date)),
    }));

    for (const week of weeks) {
        const realDays = week.days.filter((d): d is Date => d !== null);
        if (realDays.length === 0) continue;
        const weekStart = realDays[0];
        const weekEnd = realDays[realDays.length - 1];

        const activeBookings = parsed.filter((p) => p.start <= weekEnd && p.end >= weekStart);

        const laneEnds: number[] = [];

        for (const { booking, start, end } of activeBookings) {
            const clampedStart = start < weekStart ? weekStart : start;
            const clampedEnd = end > weekEnd ? weekEnd : end;

            const startCol = week.days.findIndex((d) => d && toDateKey(d) === toDateKey(clampedStart));
            const endCol = week.days.findIndex((d) => d && toDateKey(d) === toDateKey(clampedEnd));
            if (startCol === -1 || endCol === -1) continue;

            let lane = laneEnds.findIndex((e) => e < startCol);
            if (lane === -1) lane = laneEnds.length;

            laneEnds[lane] = endCol;

            if (lane < MAX_LANES) {
                week.segments.push({ booking, startCol, endCol, lane });
            } else {
                week.overflow++;
            }
        }
    }

    return weeks;
}

export default function BookingCalendar({ bookings }: { bookings: CalendarBooking[] }) {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = (firstDay.getDay() + 6) % 7;

        const days: (Date | null)[] = [];
        for (let i = 0; i < startOffset; i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));

        const remainder = days.length % 7;
        if (remainder > 0) {
            for (let i = 0; i < 7 - remainder; i++) days.push(null);
        }

        return days;
    }, [year, month]);

    const weeks = useMemo(() => buildWeeks(calendarDays, bookings), [calendarDays, bookings]);

    const today = startOfDay(new Date());
    const monthLabel = new Intl.DateTimeFormat('el-GR', { month: 'long', year: 'numeric' }).format(currentDate);

    return (
        <Card className="h-fit">
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
            <CardContent className="space-y-3">
                {/* Day name headers */}
                <div className="grid grid-cols-7">
                    {DAY_NAMES.map((d) => (
                        <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Week rows */}
                <TooltipProvider delayDuration={200}>
                    <div className="space-y-1">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-1">
                                {/* Day numbers */}
                                <div className="grid grid-cols-7">
                                    {week.days.map((day, di) => {
                                        if (!day) return <div key={`e-${wi}-${di}`} className="h-6" />;
                                        const isToday = toDateKey(day) === toDateKey(today);
                                        return (
                                            <div
                                                key={toDateKey(day)}
                                                className={`flex h-6 items-center justify-center rounded border border-gray-200 text-xs ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                                            >
                                                {day.getDate()}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Booking bars */}
                                {Array.from({ length: Math.min(MAX_LANES, Math.max(...week.segments.map((s) => s.lane + 1), 0)) }).map((_, lane) => (
                                    <div key={lane} className="grid grid-cols-7 gap-x-0.5" style={{ height: '8px' }}>
                                        {(() => {
                                            const segs = week.segments.filter((s) => s.lane === lane);
                                            const cells: React.ReactNode[] = [];
                                            let col = 0;

                                            for (const seg of segs) {
                                                if (seg.startCol > col) {
                                                    cells.push(
                                                        <div
                                                            key={`gap-${col}`}
                                                            style={{ gridColumn: `${col + 1} / ${seg.startCol + 1}` }}
                                                        />,
                                                    );
                                                }

                                                const s = STATUS_BAR[seg.booking.status] ?? STATUS_BAR.completed;
                                                const pickup = startOfDay(new Date(seg.booking.pickup_date));
                                                const ret = startOfDay(new Date(seg.booking.return_date));
                                                const weekStart = week.days.find((d): d is Date => d !== null)!;
                                                const weekDaysReal = week.days.filter((d): d is Date => d !== null);
                                                const weekEnd = weekDaysReal[weekDaysReal.length - 1];
                                                const isPickup = pickup >= weekStart;
                                                const isReturn = ret <= weekEnd;

                                                cells.push(
                                                    <Tooltip key={seg.booking.id}>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedBooking(selectedBooking?.id === seg.booking.id ? null : seg.booking)}
                                                                style={{ gridColumn: `${seg.startCol + 1} / ${seg.endCol + 2}` }}
                                                                className={`flex h-2 cursor-pointer items-center truncate px-1.5 text-[10px] font-medium leading-none ${s.bg} ${s.text} ${isPickup ? 'rounded-l-full' : ''} ${isReturn ? 'rounded-r-full' : ''} ${selectedBooking?.id === seg.booking.id ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                                                            >
                                                                {customerName(seg.booking)}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="text-xs">
                                                            <p className="font-medium">{customerName(seg.booking)}</p>
                                                            <p className="text-primary-foreground">{vehicleLabel(seg.booking)}</p>
                                                        </TooltipContent>
                                                    </Tooltip>,
                                                );

                                                col = seg.endCol + 1;
                                            }

                                            return cells;
                                        })()}
                                    </div>
                                ))}

                                {week.overflow > 0 && (
                                    <div className="px-1 text-right text-[10px] text-muted-foreground">+{week.overflow} ακόμα</div>
                                )}
                            </div>
                        ))}
                    </div>
                </TooltipProvider>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 border-t pt-3">
                    {Object.entries(STATUS_LABELS).map(([status, label]) => (
                        <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className={`h-2.5 w-5 rounded-full ${STATUS_BAR[status]?.bg}`} />
                            {label}
                        </div>
                    ))}
                </div>

                {/* Selected booking detail */}
                {selectedBooking && (
                    <div className="space-y-2 border-t pt-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">{customerName(selectedBooking)}</p>
                                <p className="text-sm text-muted-foreground">{vehicleLabel(selectedBooking)}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(selectedBooking.pickup_date).toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })}
                                    {' — '}
                                    {new Date(selectedBooking.return_date).toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <Badge
                                    variant={
                                        selectedBooking.status === 'active'
                                            ? 'success'
                                            : selectedBooking.status === 'pending'
                                                ? 'secondary'
                                                : selectedBooking.status === 'confirmed'
                                                    ? 'default'
                                                    : 'outline'
                                    }
                                    className="text-[10px]"
                                >
                                    {STATUS_LABELS[selectedBooking.status] ?? selectedBooking.status}
                                </Badge>
                                <Link href={showBooking(selectedBooking.id)} className="text-xs text-primary underline">
                                    Δείτε περισσότερα
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
