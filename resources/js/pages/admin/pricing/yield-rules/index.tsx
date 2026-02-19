import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/YieldRuleController';
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
import { index as pageIndex } from '@/routes/admin/pricing/yield-rules';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { YieldRule } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Yield Rules', href: pageIndex().url },
];

function YieldRuleForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        min_available_vehicles: number;
        price_increase_percentage: number;
        is_active: boolean;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4 my-4">
                <div className="space-y-2">
                    <Label htmlFor="yr-min-vehicles">Ελάχ. διαθέσιμα οχήματα</Label>
                    <Input
                        id="yr-min-vehicles"
                        type="number"
                        value={form.data.min_available_vehicles}
                        onChange={(e) => form.setData('min_available_vehicles', Number(e.target.value))}
                    />
                    <InputError message={form.errors.min_available_vehicles} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="yr-pct">Αύξηση (%)</Label>
                    <Input
                        id="yr-pct"
                        type="number"
                        step="0.01"
                        value={form.data.price_increase_percentage}
                        onChange={(e) => form.setData('price_increase_percentage', Number(e.target.value))}
                    />
                    <InputError message={form.errors.price_increase_percentage} />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="yr-active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                    />
                    <Label htmlFor="yr-active">Ενεργός</Label>
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
        min_available_vehicles: 0,
        price_increase_percentage: 0,
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
                    Νέος κανόνας
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέος yield rule</DialogTitle>
                    <DialogDescription>Προσθέστε κανόνα αυτόματης αύξησης τιμής.</DialogDescription>
                </DialogHeader>
                <YieldRuleForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ item }: { item: YieldRule }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        min_available_vehicles: item.min_available_vehicles,
        price_increase_percentage: item.price_increase_percentage,
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
                    <DialogTitle>Επεξεργασία κανόνα</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία του yield rule.</DialogDescription>
                </DialogHeader>
                <YieldRuleForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function YieldRulesPage({ yield_rules }: { yield_rules: PaginatedResponse<YieldRule> }) {
    function handleDelete(item: YieldRule) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε τον κανόνα;`)) return;
        router.delete(destroy(item.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yield Rules" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Yield Rules" description="Αυτόματη αύξηση τιμής βάσει διαθεσιμότητας." />
                    <CreateDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Ελάχ. Διαθέσιμα Οχήματα</th>
                                <th className="px-4 py-3 text-left font-medium">Αύξηση (%)</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yield_rules.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν κανόνες. Προσθέστε έναν για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {yield_rules.data.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{item.min_available_vehicles}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.price_increase_percentage}%</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={item.is_active ? 'success' : 'destructive'}>
                                            {item.is_active ? 'Ενεργός' : 'Ανενεργός'}
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
                    <TablePagination pagination={yield_rules} />
                </div>
            </div>
        </AppLayout>
    );
}
