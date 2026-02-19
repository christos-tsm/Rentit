import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store as storePrice, update as updatePrice } from '@/actions/App/Http/Controllers/CategorySeasonPriceController';
import { store, update, destroy } from '@/actions/App/Http/Controllers/SeasonController';
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
import { index as pageIndex } from '@/routes/admin/seasons';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { Season, VehicleCategory } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Σεζόν & Τιμές', href: pageIndex().url },
];

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}

function SeasonForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        name: string;
        start_date: string;
        end_date: string;
        is_recurring: boolean;
        priority: number;
        is_active: boolean;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4 my-4">
                <div className="space-y-2">
                    <Label htmlFor="s-name">Όνομα</Label>
                    <Input
                        id="s-name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="π.χ. Υψηλή σεζόν"
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="s-start">Έναρξη</Label>
                        <Input
                            id="s-start"
                            type="date"
                            value={form.data.start_date}
                            onChange={(e) => form.setData('start_date', e.target.value)}
                        />
                        <InputError message={form.errors.start_date} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="s-end">Λήξη</Label>
                        <Input
                            id="s-end"
                            type="date"
                            value={form.data.end_date}
                            onChange={(e) => form.setData('end_date', e.target.value)}
                        />
                        <InputError message={form.errors.end_date} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="s-priority">Προτεραιότητα</Label>
                        <Input
                            id="s-priority"
                            type="number"
                            value={form.data.priority}
                            onChange={(e) => form.setData('priority', Number(e.target.value))}
                        />
                        <InputError message={form.errors.priority} />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="s-recurring"
                            checked={form.data.is_recurring}
                            onCheckedChange={(checked) => form.setData('is_recurring', !!checked)}
                        />
                        <Label htmlFor="s-recurring">Επαναλαμβανόμενη</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="s-active"
                            checked={form.data.is_active}
                            onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                        />
                        <Label htmlFor="s-active">Ενεργή</Label>
                    </div>
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
        start_date: '',
        end_date: '',
        is_recurring: false,
        priority: 0,
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
                    Νέα σεζόν
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέα σεζόν</DialogTitle>
                    <DialogDescription>Προσθέστε μια νέα σεζόν τιμολόγησης.</DialogDescription>
                </DialogHeader>
                <SeasonForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ season }: { season: Season }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: season.name,
        start_date: season.start_date,
        end_date: season.end_date,
        is_recurring: season.is_recurring,
        priority: season.priority,
        is_active: season.is_active,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(season.id), {
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
                    <DialogTitle>Επεξεργασία σεζόν</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία της σεζόν.</DialogDescription>
                </DialogHeader>
                <SeasonForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

function PriceCell({ season, category }: { season: Season; category: VehicleCategory }) {
    const existing = season.category_prices?.find((p) => p.vehicle_category_id === category.id);
    const [value, setValue] = useState(existing?.daily_rate?.toString() ?? '');

    function handleBlur() {
        const dailyRate = parseFloat(value);
        if (isNaN(dailyRate)) return;

        const data = {
            daily_rate: dailyRate,
            vehicle_category_id: category.id,
            season_id: season.id,
        };

        if (existing) {
            router.put(updatePrice(existing.id).url, data, { preserveScroll: true });
        } else {
            router.post(storePrice().url, data, { preserveScroll: true });
        }
    }

    return (
        <Input
            type="number"
            step="0.01"
            className="w-24"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
        />
    );
}

export default function SeasonsPage({
    seasons,
    categories,
}: {
    seasons: PaginatedResponse<Season>;
    categories: VehicleCategory[];
}) {
    function handleDelete(season: Season) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε τη σεζόν "${season.name}";`)) return;
        router.delete(destroy(season.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Σεζόν & Τιμές" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Σεζόν & Τιμές" description="Διαχείριση σεζόν και τιμών ανά κατηγορία." />
                    <CreateDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Έναρξη</th>
                                <th className="px-4 py-3 text-left font-medium">Λήξη</th>
                                <th className="px-4 py-3 text-left font-medium">Επαναλαμβανόμενη</th>
                                <th className="px-4 py-3 text-left font-medium">Προτεραιότητα</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seasons.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν σεζόν. Προσθέστε μία για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {seasons.data.map((season) => (
                                <tr key={season.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{season.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{formatDate(season.start_date)}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{formatDate(season.end_date)}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={season.is_recurring ? 'success' : 'secondary'}>
                                            {season.is_recurring ? 'Ναι' : 'Όχι'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{season.priority}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={season.is_active ? 'success' : 'destructive'}>
                                            {season.is_active ? 'Ενεργή' : 'Ανενεργή'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditDialog season={season} />
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(season)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <TablePagination pagination={seasons} />
                </div>

                {seasons.data.length > 0 && categories.length > 0 && (
                    <div className="space-y-4">
                        <Heading title="Τιμές ανά Κατηγορία / Σεζόν" description="Ορίστε ημερήσιες τιμές για κάθε συνδυασμό κατηγορίας και σεζόν." />
                        <div className="rounded-lg border overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Κατηγορία</th>
                                        {seasons.data.map((season) => (
                                            <th key={season.id} className="px-4 py-3 text-left font-medium">
                                                {season.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id} className="border-b last:border-b-0">
                                            <td className="px-4 py-3 font-medium">{category.name}</td>
                                            {seasons.data.map((season) => (
                                                <td key={season.id} className="px-4 py-3">
                                                    <PriceCell season={season} category={category} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
