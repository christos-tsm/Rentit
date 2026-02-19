import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/BookingTimeAdjustmentController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import TablePagination from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { index as pageIndex } from '@/routes/admin/pricing/time-adjustments';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { BookingTimeAdjustment } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Early Bird / Last Minute', href: pageIndex().url },
];

const TYPE_OPTIONS: { value: BookingTimeAdjustment['type']; label: string }[] = [
    { value: 'early_bird', label: 'Early Bird' },
    { value: 'last_minute', label: 'Last Minute' },
];

const ADJUSTMENT_TYPE_OPTIONS: { value: BookingTimeAdjustment['adjustment_type']; label: string }[] = [
    { value: 'discount', label: 'Έκπτωση' },
    { value: 'surcharge', label: 'Προσαύξηση' },
];

function BookingTimeAdjustmentForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        name: string;
        type: BookingTimeAdjustment['type'];
        min_days_before: number;
        max_days_before: number | string;
        adjustment_type: BookingTimeAdjustment['adjustment_type'];
        percentage: number;
        is_active: boolean;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4 my-4">
                <div className="space-y-2">
                    <Label htmlFor="bta-name">Όνομα</Label>
                    <Input
                        id="bta-name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="π.χ. Early Bird -10%"
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bta-type">Τύπος</Label>
                        <Select
                            value={form.data.type}
                            onValueChange={(v) => form.setData('type', v as BookingTimeAdjustment['type'])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TYPE_OPTIONS.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.type} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bta-adj-type">Τύπος Προσαρμογής</Label>
                        <Select
                            value={form.data.adjustment_type}
                            onValueChange={(v) => form.setData('adjustment_type', v as BookingTimeAdjustment['adjustment_type'])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ADJUSTMENT_TYPE_OPTIONS.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.adjustment_type} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bta-min">Ελάχ. ημέρες πριν</Label>
                        <Input
                            id="bta-min"
                            type="number"
                            value={form.data.min_days_before}
                            onChange={(e) => form.setData('min_days_before', Number(e.target.value))}
                        />
                        <InputError message={form.errors.min_days_before} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bta-max">Μέγ. ημέρες πριν</Label>
                        <Input
                            id="bta-max"
                            type="number"
                            value={form.data.max_days_before}
                            onChange={(e) => form.setData('max_days_before', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Κενό = Απεριόριστο"
                        />
                        <InputError message={form.errors.max_days_before} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bta-pct">Ποσοστό (%)</Label>
                    <Input
                        id="bta-pct"
                        type="number"
                        step="0.01"
                        value={form.data.percentage}
                        onChange={(e) => form.setData('percentage', Number(e.target.value))}
                    />
                    <InputError message={form.errors.percentage} />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="bta-active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                    />
                    <Label htmlFor="bta-active">Ενεργή</Label>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={form.processing}>
                    {submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}

function CreateDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: '',
        type: 'early_bird' as BookingTimeAdjustment['type'],
        min_days_before: 0,
        max_days_before: '' as number | string,
        adjustment_type: 'discount' as BookingTimeAdjustment['adjustment_type'],
        percentage: 0,
        is_active: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(store(), {
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="size-4 mr-1" />
                    Νέα προσαρμογή
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέα προσαρμογή χρόνου</DialogTitle>
                    <DialogDescription>Προσθέστε μια προσαρμογή τιμής βάσει χρόνου κράτησης.</DialogDescription>
                </DialogHeader>
                <BookingTimeAdjustmentForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ item }: { item: BookingTimeAdjustment }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: item.name,
        type: item.type,
        min_days_before: item.min_days_before,
        max_days_before: (item.max_days_before ?? '') as number | string,
        adjustment_type: item.adjustment_type,
        percentage: item.percentage,
        is_active: item.is_active,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(item.id), {
            onSuccess: () => setOpen(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Επεξεργασία προσαρμογής</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία της προσαρμογής.</DialogDescription>
                </DialogHeader>
                <BookingTimeAdjustmentForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function BookingTimeAdjustmentsPage({
    booking_time_adjustments,
}: {
    booking_time_adjustments: PaginatedResponse<BookingTimeAdjustment>;
}) {
    function handleDelete(item: BookingTimeAdjustment) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε την προσαρμογή "${item.name}";`)) return;
        router.delete(destroy(item.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Early Bird / Last Minute" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Early Bird / Last Minute" description="Προσαρμογές τιμής βάσει χρόνου κράτησης." />
                    <CreateDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Τύπος</th>
                                <th className="px-4 py-3 text-left font-medium">Ελάχ. ημέρες πριν</th>
                                <th className="px-4 py-3 text-left font-medium">Μέγ. ημέρες πριν</th>
                                <th className="px-4 py-3 text-left font-medium">Τύπος Προσαρμογής</th>
                                <th className="px-4 py-3 text-left font-medium">Ποσοστό (%)</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booking_time_adjustments.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν προσαρμογές. Προσθέστε μία για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {booking_time_adjustments.data.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {TYPE_OPTIONS.find((t) => t.value === item.type)?.label}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.min_days_before}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.max_days_before ?? 'Απεριόριστο'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {ADJUSTMENT_TYPE_OPTIONS.find((t) => t.value === item.adjustment_type)?.label}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.percentage}%</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={item.is_active ? 'success' : 'destructive'}>
                                            {item.is_active ? 'Ενεργή' : 'Ανενεργή'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditDialog item={item} />
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <TablePagination pagination={booking_time_adjustments} />
                </div>
            </div>
        </AppLayout>
    );
}
