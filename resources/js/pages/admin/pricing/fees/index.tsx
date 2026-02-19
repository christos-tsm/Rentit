import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/FeeController';
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
import { index as pageIndex } from '@/routes/admin/pricing/fees';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { Fee } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Τέλη', href: pageIndex().url },
];

const FEE_TYPE_OPTIONS: { value: Fee['type']; label: string }[] = [
    { value: 'fixed', label: 'Σταθερό' },
    { value: 'per_day', label: 'Ανά ημέρα' },
];

const APPLIES_TO_OPTIONS: { value: Fee['applies_to']; label: string }[] = [
    { value: 'all', label: 'Πάντα' },
    { value: 'one_way', label: 'One-way' },
    { value: 'airport_pickup', label: 'Παραλαβή αεροδρομίου' },
    { value: 'airport_return', label: 'Παράδοση αεροδρομίου' },
];

function FeeForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        name: string;
        type: Fee['type'];
        amount: number;
        applies_to: Fee['applies_to'];
        description: string;
        is_active: boolean;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4 my-4">
                <div className="space-y-2">
                    <Label htmlFor="fee-name">Όνομα</Label>
                    <Input
                        id="fee-name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="π.χ. Τέλος one-way"
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fee-type">Τύπος</Label>
                        <Select
                            value={form.data.type}
                            onValueChange={(v) => form.setData('type', v as Fee['type'])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {FEE_TYPE_OPTIONS.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.type} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fee-amount">Ποσό</Label>
                        <Input
                            id="fee-amount"
                            type="number"
                            step="0.01"
                            value={form.data.amount}
                            onChange={(e) => form.setData('amount', Number(e.target.value))}
                        />
                        <InputError message={form.errors.amount} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fee-applies">Εφαρμογή</Label>
                    <Select
                        value={form.data.applies_to}
                        onValueChange={(v) => form.setData('applies_to', v as Fee['applies_to'])}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {APPLIES_TO_OPTIONS.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.applies_to} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fee-desc">Περιγραφή</Label>
                    <Input
                        id="fee-desc"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="Προαιρετική περιγραφή"
                    />
                    <InputError message={form.errors.description} />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="fee-active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                    />
                    <Label htmlFor="fee-active">Ενεργό</Label>
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
        type: 'fixed' as Fee['type'],
        amount: 0,
        applies_to: 'all' as Fee['applies_to'],
        description: '',
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
                    Νέο τέλος
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέο τέλος</DialogTitle>
                    <DialogDescription>Προσθέστε ένα νέο τέλος ή χρέωση.</DialogDescription>
                </DialogHeader>
                <FeeForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ item }: { item: Fee }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: item.name,
        type: item.type,
        amount: item.amount,
        applies_to: item.applies_to,
        description: item.description ?? '',
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
                    <DialogTitle>Επεξεργασία τέλους</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία του τέλους.</DialogDescription>
                </DialogHeader>
                <FeeForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function FeesPage({ fees }: { fees: PaginatedResponse<Fee> }) {
    function handleDelete(item: Fee) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε το τέλος "${item.name}";`)) return;
        router.delete(destroy(item.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Τέλη" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Τέλη" description="Σταθερά τέλη και χρεώσεις." />
                    <CreateDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Τύπος</th>
                                <th className="px-4 py-3 text-left font-medium">Ποσό</th>
                                <th className="px-4 py-3 text-left font-medium">Εφαρμογή</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν τέλη. Προσθέστε ένα για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {fees.data.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {FEE_TYPE_OPTIONS.find((t) => t.value === item.type)?.label}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.amount}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {APPLIES_TO_OPTIONS.find((t) => t.value === item.applies_to)?.label}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={item.is_active ? 'success' : 'destructive'}>
                                            {item.is_active ? 'Ενεργό' : 'Ανενεργό'}
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
                    <TablePagination pagination={fees} />
                </div>
            </div>
        </AppLayout>
    );
}
