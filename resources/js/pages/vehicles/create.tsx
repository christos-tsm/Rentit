import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as vehiclesIndex } from '@/routes/vehicles';
import { store } from '@/actions/App/Http/Controllers/VehicleController';
import type { BreadcrumbItem } from '@/types';
import type { VehicleCategory, VehicleMake, VehicleModel } from '@/types/admin';

type Props = {
    makes: VehicleMake[];
    categories: VehicleCategory[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Οχήματα', href: vehiclesIndex().url },
    { title: 'Νέο όχημα', href: '#' },
];

const FUEL_TYPES = [
    { value: 'petrol', label: 'Βενζίνη' },
    { value: 'diesel', label: 'Πετρέλαιο' },
    { value: 'electric', label: 'Ηλεκτρικό' },
    { value: 'hybrid', label: 'Υβριδικό' },
];

const TRANSMISSIONS = [
    { value: 'manual', label: 'Χειροκίνητο' },
    { value: 'automatic', label: 'Αυτόματο' },
];

export default function VehicleCreatePage({ makes, categories }: Props) {
    const [selectedMakeId, setSelectedMakeId] = useState('');
    const [availableModels, setAvailableModels] = useState<VehicleModel[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);

    const form = useForm({
        vehicle_category_id: '',
        vehicle_model_id: '',
        plate_number: '',
        cc: '',
        seats: '',
        large_bags_capacity: '',
        small_bags_capacity: '',
        doors: '',
        ac: true,
        gears: '',
        hp: '',
        base_price: '',
        vin: '',
        fuel_type: '',
        transmission: '',
        current_km: '0',
    });

    useEffect(() => {
        if (!selectedMakeId) {
            setAvailableModels([]);
            form.setData('vehicle_model_id', '');
            return;
        }

        setLoadingModels(true);
        fetch(`/api/vehicle-models?make_id=${selectedMakeId}`)
            .then((res) => res.json())
            .then((data: VehicleModel[]) => {
                setAvailableModels(data);
                form.setData('vehicle_model_id', '');
            })
            .finally(() => setLoadingModels(false));
    }, [selectedMakeId]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.submit(store());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-6 py-6 max-w-2xl">
                <Heading title="Νέο όχημα" description="Καταχωρήστε ένα νέο όχημα στο σύστημα." />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Μάρκα / Μοντέλο */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Μάρκα</Label>
                            <Select value={selectedMakeId} onValueChange={setSelectedMakeId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Επιλέξτε μάρκα" />
                                </SelectTrigger>
                                <SelectContent>
                                    {makes.map((make) => (
                                        <SelectItem key={make.id} value={String(make.id)}>{make.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Μοντέλο</Label>
                            <Select
                                value={form.data.vehicle_model_id}
                                onValueChange={(v) => form.setData('vehicle_model_id', v)}
                                disabled={!selectedMakeId || loadingModels}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingModels ? 'Φόρτωση...' : 'Επιλέξτε μοντέλο'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableModels.map((model) => (
                                        <SelectItem key={model.id} value={String(model.id)}>{model.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.vehicle_model_id} />
                        </div>
                    </div>

                    {/* Κατηγορία */}
                    <div className="space-y-2">
                        <Label>Κατηγορία</Label>
                        <Select value={form.data.vehicle_category_id} onValueChange={(v) => form.setData('vehicle_category_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Επιλέξτε κατηγορία" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.vehicle_category_id} />
                    </div>

                    {/* Πινακίδες / VIN */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="plate_number">Αρ. Κυκλοφορίας</Label>
                            <Input id="plate_number" value={form.data.plate_number} onChange={(e) => form.setData('plate_number', e.target.value.toUpperCase())} placeholder="π.χ. ΑΒΓ-1234" />
                            <InputError message={form.errors.plate_number} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vin">VIN (προαιρετικό)</Label>
                            <Input id="vin" value={form.data.vin} onChange={(e) => form.setData('vin', e.target.value.toUpperCase())} placeholder="17 χαρακτήρες" maxLength={17} />
                            <InputError message={form.errors.vin} />
                        </div>
                    </div>

                    {/* Τεχνικά στοιχεία */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cc">Κυβικά (cc)</Label>
                            <Input id="cc" type="number" min="1" value={form.data.cc} onChange={(e) => form.setData('cc', e.target.value)} placeholder="π.χ. 1600" />
                            <InputError message={form.errors.cc} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hp">Ίπποι (hp)</Label>
                            <Input id="hp" type="number" min="1" value={form.data.hp} onChange={(e) => form.setData('hp', e.target.value)} placeholder="π.χ. 120" />
                            <InputError message={form.errors.hp} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gears">Σχέσεις</Label>
                            <Input id="gears" type="number" min="1" max="12" value={form.data.gears} onChange={(e) => form.setData('gears', e.target.value)} placeholder="π.χ. 6" />
                            <InputError message={form.errors.gears} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="seats">Θέσεις</Label>
                            <Input id="seats" type="number" min="1" max="50" value={form.data.seats} onChange={(e) => form.setData('seats', e.target.value)} placeholder="π.χ. 5" />
                            <InputError message={form.errors.seats} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doors">Πόρτες</Label>
                            <Input id="doors" type="number" min="1" max="10" value={form.data.doors} onChange={(e) => form.setData('doors', e.target.value)} placeholder="π.χ. 5" />
                            <InputError message={form.errors.doors} />
                        </div>
                        <div className="flex items-end pb-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="ac" checked={form.data.ac} onCheckedChange={(checked) => form.setData('ac', checked === true)} />
                                <Label htmlFor="ac">A/C</Label>
                            </div>
                        </div>
                    </div>

                    {/* Χωρητικότητα αποσκευών */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="large_bags_capacity">Μεγάλες αποσκευές</Label>
                            <Input id="large_bags_capacity" type="number" min="0" value={form.data.large_bags_capacity} onChange={(e) => form.setData('large_bags_capacity', e.target.value)} placeholder="π.χ. 2" />
                            <InputError message={form.errors.large_bags_capacity} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="small_bags_capacity">Μικρές αποσκευές</Label>
                            <Input id="small_bags_capacity" type="number" min="0" value={form.data.small_bags_capacity} onChange={(e) => form.setData('small_bags_capacity', e.target.value)} placeholder="π.χ. 2" />
                            <InputError message={form.errors.small_bags_capacity} />
                        </div>
                    </div>

                    {/* Καύσιμο / Κιβώτιο */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Καύσιμο</Label>
                            <Select value={form.data.fuel_type} onValueChange={(v) => form.setData('fuel_type', v)}>
                                <SelectTrigger><SelectValue placeholder="Επιλέξτε καύσιμο" /></SelectTrigger>
                                <SelectContent>
                                    {FUEL_TYPES.map((ft) => (
                                        <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.fuel_type} />
                        </div>
                        <div className="space-y-2">
                            <Label>Κιβώτιο</Label>
                            <Select value={form.data.transmission} onValueChange={(v) => form.setData('transmission', v)}>
                                <SelectTrigger><SelectValue placeholder="Επιλέξτε κιβώτιο" /></SelectTrigger>
                                <SelectContent>
                                    {TRANSMISSIONS.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.transmission} />
                        </div>
                    </div>

                    {/* Τιμή / Χιλιόμετρα */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="base_price">Βασική τιμή/ημέρα (€)</Label>
                            <Input id="base_price" type="number" min="0" step="0.01" value={form.data.base_price} onChange={(e) => form.setData('base_price', e.target.value)} placeholder="π.χ. 45.00" />
                            <InputError message={form.errors.base_price} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current_km">Τρέχοντα χιλιόμετρα</Label>
                            <Input id="current_km" type="number" min="0" value={form.data.current_km} onChange={(e) => form.setData('current_km', e.target.value)} />
                            <InputError message={form.errors.current_km} />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={form.processing}>Αποθήκευση</Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>Ακύρωση</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
