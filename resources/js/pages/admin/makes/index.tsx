import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/VehicleMakeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { index as makesIndex } from '@/routes/admin/makes';
import type { BreadcrumbItem } from '@/types';
import type { VehicleMake } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Μάρκες', href: makesIndex().url },
];

function CreateMakeDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm({ name: '' });

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
                    Νέα μάρκα
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Νέα μάρκα</DialogTitle>
                        <DialogDescription>Προσθέστε μια νέα μάρκα οχήματος.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-2">
                        <Label htmlFor="create-name">Όνομα</Label>
                        <Input
                            id="create-name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="π.χ. Volkswagen"
                        />
                        <InputError message={form.errors.name} />
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

function EditMakeDialog({ make }: { make: VehicleMake }) {
    const [open, setOpen] = useState(false);
    const form = useForm({ name: make.name });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(make.id), {
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
                        <DialogTitle>Επεξεργασία μάρκας</DialogTitle>
                        <DialogDescription>Αλλάξτε το όνομα της μάρκας.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-2">
                        <Label htmlFor={`edit-name-${make.id}`}>Όνομα</Label>
                        <Input
                            id={`edit-name-${make.id}`}
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="π.χ. Volkswagen"
                        />
                        <InputError message={form.errors.name} />
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

export default function MakesPage({ makes }: { makes: VehicleMake[] }) {
    function handleDelete(make: VehicleMake) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε την μάρκα "${make.name}";`)) return;
        router.delete(destroy(make.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Μάρκες οχημάτων" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Μάρκες" description="Διαχείριση μαρκών οχημάτων." />
                    <CreateMakeDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Μοντέλα</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {makes.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν μάρκες. Προσθέστε μία για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {makes.map((make) => (
                                <tr key={make.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{make.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {make.vehicle_models_count ?? 0}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditMakeDialog make={make} />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(make)}
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
