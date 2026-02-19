import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/LocationController';
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
import { index as locationsIndex } from '@/routes/admin/locations';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { Location, LocationType } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Τοποθεσίες', href: locationsIndex().url },
];

const LOCATION_TYPES: { value: LocationType; label: string }[] = [
    { value: 'airport', label: 'Αεροδρόμιο' },
    { value: 'office', label: 'Γραφείο' },
    { value: 'hotel', label: 'Ξενοδοχείο' },
    { value: 'port', label: 'Λιμάνι' },
    { value: 'other', label: 'Άλλο' },
];

function LocationForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<{
        name: string;
        address: string;
        email: string;
        phone: string;
        coordinates: string;
        operating_hours: string;
        type: LocationType;
        is_active: boolean;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4 my-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="loc-name">Όνομα</Label>
                        <Input
                            id="loc-name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="π.χ. Αεροδρόμιο Ηρακλείου"
                        />
                        <InputError message={form.errors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="loc-type">Τύπος</Label>
                        <Select
                            value={form.data.type}
                            onValueChange={(v) => form.setData('type', v as LocationType)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LOCATION_TYPES.map((t) => (
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
                    <Label htmlFor="loc-address">Διεύθυνση</Label>
                    <Input
                        id="loc-address"
                        value={form.data.address}
                        onChange={(e) => form.setData('address', e.target.value)}
                        placeholder="π.χ. Λεωφ. Ικάρου, Ηράκλειο"
                    />
                    <InputError message={form.errors.address} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="loc-email">Email</Label>
                        <Input
                            id="loc-email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            placeholder="info@example.com"
                        />
                        <InputError message={form.errors.email} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="loc-phone">Τηλέφωνο</Label>
                        <Input
                            id="loc-phone"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            placeholder="+30 210 1234567"
                        />
                        <InputError message={form.errors.phone} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="loc-coords">Συντεταγμένες</Label>
                        <Input
                            id="loc-coords"
                            value={form.data.coordinates}
                            onChange={(e) => form.setData('coordinates', e.target.value)}
                            placeholder="35.3387, 25.1803"
                        />
                        <InputError message={form.errors.coordinates} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="loc-hours">Ωράριο</Label>
                        <Input
                            id="loc-hours"
                            value={form.data.operating_hours}
                            onChange={(e) => form.setData('operating_hours', e.target.value)}
                            placeholder="08:00-20:00"
                        />
                        <InputError message={form.errors.operating_hours} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="loc-active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                    />
                    <Label htmlFor="loc-active">Ενεργή</Label>
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

function CreateLocationDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: '',
        address: '',
        email: '',
        phone: '',
        coordinates: '',
        operating_hours: '',
        type: 'office' as LocationType,
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
                    Νέα τοποθεσία
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέα τοποθεσία</DialogTitle>
                    <DialogDescription>Προσθέστε ένα νέο σημείο παραλαβής/παράδοσης.</DialogDescription>
                </DialogHeader>
                <LocationForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditLocationDialog({ location }: { location: Location }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: location.name,
        address: location.address ?? '',
        email: location.email ?? '',
        phone: location.phone ?? '',
        coordinates: location.coordinates ?? '',
        operating_hours: location.operating_hours ?? '',
        type: location.type,
        is_active: location.is_active,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(location.id), {
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
                    <DialogTitle>Επεξεργασία τοποθεσίας</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία της τοποθεσίας.</DialogDescription>
                </DialogHeader>
                <LocationForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function LocationsPage({ locations }: { locations: PaginatedResponse<Location> }) {
    function handleDelete(location: Location) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε την τοποθεσία "${location.name}";`)) return;
        router.delete(destroy(location.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Τοποθεσίες" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Τοποθεσίες" description="Σημεία παραλαβής & παράδοσης οχημάτων." />
                    <CreateLocationDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Τύπος</th>
                                <th className="px-4 py-3 text-left font-medium">Διεύθυνση</th>
                                <th className="px-4 py-3 text-left font-medium">Τηλέφωνο</th>
                                <th className="px-4 py-3 text-left font-medium">Κατάσταση</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν τοποθεσίες. Προσθέστε μία για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {locations.data.map((location) => (
                                <tr key={location.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{location.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {LOCATION_TYPES.find((t) => t.value === location.type)?.label}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{location.address || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{location.phone || '—'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={location.is_active ? 'success' : 'destructive'}>
                                            {location.is_active ? 'Ενεργή' : 'Ανενεργή'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditLocationDialog location={location} />
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(location)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <TablePagination pagination={locations} />
                </div>
            </div>
        </AppLayout>
    );
}
