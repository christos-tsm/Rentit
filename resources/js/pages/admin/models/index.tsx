import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as modelsIndex } from '@/routes/admin/models';
import { store, update, destroy } from '@/actions/App/Http/Controllers/VehicleModelController';
import type { BreadcrumbItem } from '@/types';
import type { VehicleMake, VehicleModel } from '@/types/admin';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Μοντέλα', href: modelsIndex().url },
];

function CreateModelDialog({ makes }: { makes: VehicleMake[] }) {
    const [open, setOpen] = useState(false);
    const form = useForm({ vehicle_make_id: '', name: '' });

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
                    Νέο μοντέλο
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Νέο μοντέλο</DialogTitle>
                        <DialogDescription>Προσθέστε ένα νέο μοντέλο οχήματος.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Μάρκα</Label>
                            <Select
                                value={form.data.vehicle_make_id}
                                onValueChange={(value) => form.setData('vehicle_make_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Επιλέξτε μάρκα" />
                                </SelectTrigger>
                                <SelectContent>
                                    {makes.map((make) => (
                                        <SelectItem key={make.id} value={String(make.id)}>
                                            {make.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.vehicle_make_id} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-model-name">Όνομα</Label>
                            <Input
                                id="create-model-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="π.χ. Golf 1.6"
                            />
                            <InputError message={form.errors.name} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            Αποθήκευση
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditModelDialog({ model, makes }: { model: VehicleModel; makes: VehicleMake[] }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        vehicle_make_id: String(model.vehicle_make_id),
        name: model.name,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(model.id), {
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
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Επεξεργασία μοντέλου</DialogTitle>
                        <DialogDescription>Αλλάξτε τα στοιχεία του μοντέλου.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Μάρκα</Label>
                            <Select
                                value={form.data.vehicle_make_id}
                                onValueChange={(value) => form.setData('vehicle_make_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Επιλέξτε μάρκα" />
                                </SelectTrigger>
                                <SelectContent>
                                    {makes.map((make) => (
                                        <SelectItem key={make.id} value={String(make.id)}>
                                            {make.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.vehicle_make_id} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`edit-model-name-${model.id}`}>Όνομα</Label>
                            <Input
                                id={`edit-model-name-${model.id}`}
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="π.χ. Golf 1.6"
                            />
                            <InputError message={form.errors.name} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            Ενημέρωση
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

type Props = {
    models: VehicleModel[];
    makes: VehicleMake[];
    selectedMakeId: number | null;
};

export default function ModelsPage({ models, makes, selectedMakeId }: Props) {
    function handleDelete(model: VehicleModel) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε το μοντέλο "${model.name}";`)) return;
        router.delete(destroy(model.id).url);
    }

    function handleFilterByMake(value: string) {
        const makeId = value === 'all' ? undefined : value;
        router.get(modelsIndex().url, makeId ? { make_id: makeId } : {}, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Μοντέλα" description="Διαχείριση μοντέλων οχημάτων." />
                    <CreateModelDialog makes={makes} />
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-64">
                        <Label className="mb-2 block">Φιλτράρισμα ανά μάρκα</Label>
                        <Select
                            value={selectedMakeId ? String(selectedMakeId) : 'all'}
                            onValueChange={handleFilterByMake}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Όλες οι μάρκες" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Όλες οι μάρκες</SelectItem>
                                {makes.map((make) => (
                                    <SelectItem key={make.id} value={String(make.id)}>
                                        {make.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Μάρκα</th>
                                <th className="px-4 py-3 text-left font-medium">Μοντέλο</th>
                                <th className="px-4 py-3 text-left font-medium">Οχήματα</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν μοντέλα. Προσθέστε ένα για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {models.map((model) => (
                                <tr key={model.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {model.make?.name}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{model.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {model.vehicles_count ?? 0}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditModelDialog model={model} makes={makes} />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(model)}
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
