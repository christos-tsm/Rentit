import { useForm, router, Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/CustomerController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import TablePagination from '@/components/table-pagination';
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
import { index as customersIndex } from '@/routes/admin/customers';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { Customer } from '@/types/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Πελάτες', href: customersIndex().url },
];

type CustomerFormData = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    driver_license_number: string;
    date_of_birth: string;
    address: string;
    notes: string;
};

function CustomerForm({
    form,
    onSubmit,
    submitLabel,
}: {
    form: ReturnType<typeof useForm<CustomerFormData>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="my-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cust-first-name">Όνομα</Label>
                        <Input
                            id="cust-first-name"
                            value={form.data.first_name}
                            onChange={(e) => form.setData('first_name', e.target.value)}
                            placeholder="π.χ. Γιάννης"
                        />
                        <InputError message={form.errors.first_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cust-last-name">Επώνυμο</Label>
                        <Input
                            id="cust-last-name"
                            value={form.data.last_name}
                            onChange={(e) => form.setData('last_name', e.target.value)}
                            placeholder="π.χ. Παπαδόπουλος"
                        />
                        <InputError message={form.errors.last_name} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cust-email">Email</Label>
                        <Input
                            id="cust-email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={form.errors.email} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cust-phone">Τηλέφωνο</Label>
                        <Input
                            id="cust-phone"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            placeholder="+30 210 1234567"
                        />
                        <InputError message={form.errors.phone} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cust-license">Αρ. Διπλώματος</Label>
                        <Input
                            id="cust-license"
                            value={form.data.driver_license_number}
                            onChange={(e) => form.setData('driver_license_number', e.target.value)}
                            placeholder="π.χ. AB123456"
                        />
                        <InputError message={form.errors.driver_license_number} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cust-dob">Ημ. Γέννησης</Label>
                        <Input
                            id="cust-dob"
                            type="date"
                            value={form.data.date_of_birth}
                            onChange={(e) => form.setData('date_of_birth', e.target.value)}
                        />
                        <InputError message={form.errors.date_of_birth} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cust-address">Διεύθυνση</Label>
                    <Input
                        id="cust-address"
                        value={form.data.address}
                        onChange={(e) => form.setData('address', e.target.value)}
                        placeholder="π.χ. Λεωφ. Αλεξάνδρας 100, Αθήνα"
                    />
                    <InputError message={form.errors.address} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cust-notes">Σημειώσεις</Label>
                    <Input
                        id="cust-notes"
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                        placeholder="Προαιρετικές σημειώσεις..."
                    />
                    <InputError message={form.errors.notes} />
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

function CreateCustomerDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm<CustomerFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        driver_license_number: '',
        date_of_birth: '',
        address: '',
        notes: '',
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
                    <Plus className="mr-1 size-4" />
                    Νέος πελάτης
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Νέος πελάτης</DialogTitle>
                    <DialogDescription>Προσθέστε έναν νέο πελάτη.</DialogDescription>
                </DialogHeader>
                <CustomerForm form={form} onSubmit={handleSubmit} submitLabel="Αποθήκευση" />
            </DialogContent>
        </Dialog>
    );
}

function EditCustomerDialog({ customer }: { customer: Customer }) {
    const [open, setOpen] = useState(false);
    const form = useForm<CustomerFormData>({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        driver_license_number: customer.driver_license_number,
        date_of_birth: customer.date_of_birth ?? '',
        address: customer.address ?? '',
        notes: customer.notes ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(update(customer.id), {
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
                    <DialogTitle>Επεξεργασία πελάτη</DialogTitle>
                    <DialogDescription>Αλλάξτε τα στοιχεία του πελάτη.</DialogDescription>
                </DialogHeader>
                <CustomerForm form={form} onSubmit={handleSubmit} submitLabel="Ενημέρωση" />
            </DialogContent>
        </Dialog>
    );
}

export default function CustomersPage({ customers }: { customers: PaginatedResponse<Customer> }) {
    function handleDelete(customer: Customer) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε τον πελάτη "${customer.first_name} ${customer.last_name}";`)) return;
        router.delete(destroy(customer.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Πελάτες" />
            <div className="space-y-6 px-6 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Πελάτες" description="Διαχείριση πελατών." />
                    <CreateCustomerDialog />
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Ονοματεπώνυμο</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Τηλέφωνο</th>
                                <th className="px-4 py-3 text-left font-medium">Δίπλωμα</th>
                                <th className="px-4 py-3 text-left font-medium">Κρατήσεις</th>
                                <th className="px-4 py-3 text-right font-medium">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Δεν υπάρχουν πελάτες. Προσθέστε έναν για να ξεκινήσετε.
                                    </td>
                                </tr>
                            )}
                            {customers.data.map((customer) => (
                                <tr key={customer.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 font-medium">
                                        {customer.first_name} {customer.last_name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{customer.phone || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{customer.driver_license_number || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{customer.bookings_count ?? 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditCustomerDialog customer={customer} />
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(customer)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <TablePagination pagination={customers} />
                </div>
            </div>
        </AppLayout>
    );
}
