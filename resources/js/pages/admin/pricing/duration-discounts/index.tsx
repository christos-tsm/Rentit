import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/DurationDiscountController';
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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as pageIndex } from '@/routes/admin/pricing/duration-discounts';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { DurationDiscount } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Εκπτώσεις Διάρκειας', href: pageIndex().url },
];

function DurationDiscountForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        name: string;
        min_days: number;
        max_days: number | string;
        discount_percentage: number;
        is_active: boolean;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4 my-4">
                <div className="space-y-2">
                    <Label htmlFor="dd-name">Όνομα</Label>
                    <Input
                        id="dd-name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="π.χ. Εβδομαδιαία έκπτωση"
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dd-min">Ελάχ. ημέρες</Label>
                        <Input
                            id="dd-min"
                            type="number"
                            value={form.data.min_days}
                            onChange={(e) => form.setData('min_days', Number(e.target.value))}
                        />
                        <InputError message={form.errors.min_days} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dd-max">Μέγ. ημέρες</Label>
                        <Input
                            id="dd-max"
                            type="number"
                            value={form.data.max_days}
                            onChange={(e) => form.setData('max_days', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Κενό = Απεριόριστο"
                        />
                        <InputError message={form.errors.max_days} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dd-pct">Έκπτωση (%)</Label>
                    <Input
                        id="dd-pct"
                        type="number"
                        step="0.01"
                        value={form.data.discount_percentage}
                        onChange={(e) => form.setData('discount_percentage', Number(e.target.value))}
                    />
                    <InputError message={form.errors.discount_percentage} />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="dd-active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                    />
                    <Label htmlFor="dd-active">Ενεργή</Label>
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
        min_days: 1,
        max_days: '' as number | string,
        discount_percentage: 0,
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
                    Νέα έκπτωση
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέα έκπτωση διάρκειας</DialogTitle>
                    <DialogDescription>Προσθέστε μια κλιμακωτή έκπτωση βάσει ημερών.</DialogDescription>
                </DialogHeader>
                <DurationDiscountForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ item }: { item: DurationDiscount }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: item.name,
        min_days: item.min_days,
        max_days: (item.max_days ?? '') as number | string,
        discount_percentage: item.discount_percentage,
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
                    <DialogTitle>Επεξεργασία έκπτωσης</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία της έκπτωσης.</DialogDescription>
                </DialogHeader>
                <DurationDiscountForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function DurationDiscountsPage({ duration_discounts }: { duration_discounts: PaginatedResponse<DurationDiscount> }) {
    function handleDelete(item: DurationDiscount) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε την έκπτωση "${item.name}";`)) return;
        router.delete(destroy(item.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Εκπτώσεις Διάρκειας" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Εκπτώσεις Διάρκειας" description="Κλιμακωτές εκπτώσεις βάσει ημερών ενοικίασης." />
                    <CreateDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Ελάχ. ημέρες</th>
                                <th className="px-4 py-3 text-left font-medium">Μέγ. ημέρες</th>
                                <th className="px-4 py-3 text-left font-medium">Έκπτωση (%)</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {duration_discounts.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν εκπτώσεις. Προσθέστε μία για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {duration_discounts.data.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.min_days}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.max_days ?? 'Απεριόριστο'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.discount_percentage}%</td>
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
                    <TablePagination pagination={duration_discounts} />
                </div>
            </div>
        </AppLayout>
    );
}
