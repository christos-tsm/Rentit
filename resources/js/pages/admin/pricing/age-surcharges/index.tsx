import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/DriverAgeSurchargeController';
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
import { index as pageIndex } from '@/routes/admin/pricing/age-surcharges';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { DriverAgeSurcharge } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Χρεώσεις Ηλικίας Οδηγού', href: pageIndex().url },
];

const SURCHARGE_TYPE_OPTIONS: { value: DriverAgeSurcharge['surcharge_type']; label: string }[] = [
    { value: 'fixed', label: 'Σταθερό' },
    { value: 'percentage', label: 'Ποσοστό' },
];

function DriverAgeSurchargeForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        name: string;
        min_age: number;
        max_age: number;
        surcharge_type: DriverAgeSurcharge['surcharge_type'];
        amount: number;
        is_active: boolean;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4 my-4">
                <div className="space-y-2">
                    <Label htmlFor="das-name">Όνομα</Label>
                    <Input
                        id="das-name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="π.χ. Νέος οδηγός (18-21)"
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="das-min-age">Ελάχ. Ηλικία</Label>
                        <Input
                            id="das-min-age"
                            type="number"
                            value={form.data.min_age}
                            onChange={(e) => form.setData('min_age', Number(e.target.value))}
                        />
                        <InputError message={form.errors.min_age} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="das-max-age">Μέγ. Ηλικία</Label>
                        <Input
                            id="das-max-age"
                            type="number"
                            value={form.data.max_age}
                            onChange={(e) => form.setData('max_age', Number(e.target.value))}
                        />
                        <InputError message={form.errors.max_age} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="das-type">Τύπος</Label>
                        <Select
                            value={form.data.surcharge_type}
                            onValueChange={(v) => form.setData('surcharge_type', v as DriverAgeSurcharge['surcharge_type'])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SURCHARGE_TYPE_OPTIONS.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.surcharge_type} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="das-amount">Ποσό</Label>
                        <Input
                            id="das-amount"
                            type="number"
                            step="0.01"
                            value={form.data.amount}
                            onChange={(e) => form.setData('amount', Number(e.target.value))}
                        />
                        <InputError message={form.errors.amount} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="das-active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                    />
                    <Label htmlFor="das-active">Ενεργή</Label>
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
        min_age: 18,
        max_age: 25,
        surcharge_type: 'fixed' as DriverAgeSurcharge['surcharge_type'],
        amount: 0,
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
                    Νέα χρέωση
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέα χρέωση ηλικίας</DialogTitle>
                    <DialogDescription>Προσθέστε μια προσαύξηση βάσει ηλικίας οδηγού.</DialogDescription>
                </DialogHeader>
                <DriverAgeSurchargeForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ item }: { item: DriverAgeSurcharge }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: item.name,
        min_age: item.min_age,
        max_age: item.max_age,
        surcharge_type: item.surcharge_type,
        amount: item.amount,
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
                    <DialogTitle>Επεξεργασία χρέωσης</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία της χρέωσης ηλικίας.</DialogDescription>
                </DialogHeader>
                <DriverAgeSurchargeForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function DriverAgeSurchargesPage({
    driver_age_surcharges,
}: {
    driver_age_surcharges: PaginatedResponse<DriverAgeSurcharge>;
}) {
    function handleDelete(item: DriverAgeSurcharge) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε τη χρέωση "${item.name}";`)) return;
        router.delete(destroy(item.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Χρεώσεις Ηλικίας Οδηγού" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Χρεώσεις Ηλικίας Οδηγού" description="Προσαυξήσεις βάσει ηλικίας οδηγού." />
                    <CreateDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Ελάχ. Ηλικία</th>
                                <th className="px-4 py-3 text-left font-medium">Μέγ. Ηλικία</th>
                                <th className="px-4 py-3 text-left font-medium">Τύπος</th>
                                <th className="px-4 py-3 text-left font-medium">Ποσό</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driver_age_surcharges.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν χρεώσεις. Προσθέστε μία για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {driver_age_surcharges.data.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.min_age}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.max_age}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {SURCHARGE_TYPE_OPTIONS.find((t) => t.value === item.surcharge_type)?.label}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.amount}</td>
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
                    <TablePagination pagination={driver_age_surcharges} />
                </div>
            </div>
        </AppLayout>
    );
}
