import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/ExtraController';
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
import { index as pageIndex } from '@/routes/admin/extras';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { Extra } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Extras', href: pageIndex().url },
];

const EXTRA_TYPE_OPTIONS: { value: Extra['type']; label: string }[] = [
    { value: 'per_day', label: 'Ανά ημέρα' },
    { value: 'per_rental', label: 'Ανά ενοικίαση' },
];

function ExtraForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        name: string;
        price_per_day: number;
        type: Extra['type'];
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
                    <Label htmlFor="ext-name">Όνομα</Label>
                    <Input
                        id="ext-name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="π.χ. GPS, Παιδικό κάθισμα"
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ext-price">Τιμή</Label>
                        <Input
                            id="ext-price"
                            type="number"
                            step="0.01"
                            value={form.data.price_per_day}
                            onChange={(e) => form.setData('price_per_day', Number(e.target.value))}
                        />
                        <InputError message={form.errors.price_per_day} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ext-type">Τύπος</Label>
                        <Select
                            value={form.data.type}
                            onValueChange={(v) => form.setData('type', v as Extra['type'])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {EXTRA_TYPE_OPTIONS.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.type} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ext-desc">Περιγραφή</Label>
                    <Input
                        id="ext-desc"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="Προαιρετική περιγραφή"
                    />
                    <InputError message={form.errors.description} />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="ext-active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                    />
                    <Label htmlFor="ext-active">Ενεργό</Label>
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
        price_per_day: 0,
        type: 'per_day' as Extra['type'],
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
                    Νέο extra
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέο extra</DialogTitle>
                    <DialogDescription>Προσθέστε μια πρόσθετη υπηρεσία ή εξοπλισμό.</DialogDescription>
                </DialogHeader>
                <ExtraForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ item }: { item: Extra }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: item.name,
        price_per_day: item.price_per_day,
        type: item.type,
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
                    <DialogTitle>Επεξεργασία extra</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία του extra.</DialogDescription>
                </DialogHeader>
                <ExtraForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function ExtrasPage({ extras }: { extras: PaginatedResponse<Extra> }) {
    function handleDelete(item: Extra) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε το extra "${item.name}";`)) return;
        router.delete(destroy(item.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Extras" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Extras" description="Πρόσθετες υπηρεσίες και εξοπλισμός." />
                    <CreateDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Τιμή</th>
                                <th className="px-4 py-3 text-left font-medium">Τύπος</th>
                                <th className="px-4 py-3 text-left font-medium">Περιγραφή</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extras.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν extras. Προσθέστε ένα για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {extras.data.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.price_per_day}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {EXTRA_TYPE_OPTIONS.find((t) => t.value === item.type)?.label}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.description || '—'}</td>
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
                    <TablePagination pagination={extras} />
                </div>
            </div>
        </AppLayout>
    );
}
