import { useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { index as categoriesIndex } from '@/routes/admin/categories';
import { store, update, destroy } from '@/actions/App/Http/Controllers/VehicleCategoryController';
import type { BreadcrumbItem } from '@/types';
import type { VehicleCategory } from '@/types/admin';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Κατηγορίες', href: categoriesIndex().url },
];

function CreateCategoryDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm({ name: '', description: '', base_price_per_day: '' });

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
                    Νέα κατηγορία
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Νέα κατηγορία</DialogTitle>
                        <DialogDescription>Προσθέστε μια νέα κατηγορία οχήματος.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-cat-name">Όνομα</Label>
                            <Input id="create-cat-name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="π.χ. SUV" />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-cat-desc">Περιγραφή (προαιρετικό)</Label>
                            <Input id="create-cat-desc" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} placeholder="Σύντομη περιγραφή" />
                            <InputError message={form.errors.description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-cat-price">Βασική τιμή/ημέρα (€)</Label>
                            <Input id="create-cat-price" type="number" min="0" step="0.01" value={form.data.base_price_per_day} onChange={(e) => form.setData('base_price_per_day', e.target.value)} placeholder="π.χ. 45.00" />
                            <InputError message={form.errors.base_price_per_day} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>Αποθήκευση</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditCategoryDialog({ category }: { category: VehicleCategory }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: category.name,
        description: category.description ?? '',
        base_price_per_day: String(category.base_price_per_day),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(category.id), {
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
                        <DialogTitle>Επεξεργασία κατηγορίας</DialogTitle>
                        <DialogDescription>Αλλάξτε τα στοιχεία της κατηγορίας.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`edit-cat-name-${category.id}`}>Όνομα</Label>
                            <Input id={`edit-cat-name-${category.id}`} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`edit-cat-desc-${category.id}`}>Περιγραφή</Label>
                            <Input id={`edit-cat-desc-${category.id}`} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                            <InputError message={form.errors.description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`edit-cat-price-${category.id}`}>Βασική τιμή/ημέρα (€)</Label>
                            <Input id={`edit-cat-price-${category.id}`} type="number" min="0" step="0.01" value={form.data.base_price_per_day} onChange={(e) => form.setData('base_price_per_day', e.target.value)} />
                            <InputError message={form.errors.base_price_per_day} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>Ενημέρωση</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function CategoriesPage({ categories }: { categories: VehicleCategory[] }) {
    function handleDelete(category: VehicleCategory) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε την κατηγορία "${category.name}";`)) return;
        router.delete(destroy(category.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Κατηγορίες οχημάτων" />
            <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Κατηγορίες" description="Διαχείριση κατηγοριών οχημάτων." />
                    <CreateCategoryDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                                <th className="px-4 py-3 text-left font-medium">Περιγραφή</th>
                                <th className="px-4 py-3 text-left font-medium">Τιμή/ημέρα</th>
                                <th className="px-4 py-3 text-left font-medium">Οχήματα</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν κατηγορίες. Προσθέστε μία για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">{category.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{category.description || '—'}</td>
                                    <td className="px-4 py-3">{category.base_price_per_day}€</td>
                                    <td className="px-4 py-3 text-muted-foreground">{category.vehicles_count ?? 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditCategoryDialog category={category} />
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(category)}>
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
