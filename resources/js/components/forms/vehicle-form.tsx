import React, { useEffect, useState } from 'react';
import { VehicleCategory, VehicleMake, VehicleModel } from "@/types/admin";
import { store } from '@/actions/App/Http/Controllers/VehicleController';
import { Vehicle, STATUS } from "@/types/vehicles";
import { useForm } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FUEL_TYPES, TRANSMISSIONS, VEHICLE_STATUSES } from "@/lib/vehicle-constants";
import { update } from "@/routes/vehicles";

const VehicleForm = ({ vehicle, makes, categories, isEdit = false }: { vehicle: Vehicle | null, makes: VehicleMake[], categories: VehicleCategory[], isEdit?: boolean }) => {
    const [selectedMakeId, setSelectedMakeId] = useState(String(vehicle?.vehicle_model?.vehicle_make_id) || '');
    const [availableModels, setAvailableModels] = useState<VehicleModel[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);

    const form = useForm({
        vehicle_category_id: vehicle?.vehicle_category_id || '',
        vehicle_model_id: vehicle?.vehicle_model_id || '',
        plate_number: vehicle?.plate_number || '',
        cc: vehicle?.cc || '',
        seats: vehicle?.seats || '',
        large_bags_capacity: vehicle?.large_bags_capacity || '',
        small_bags_capacity: vehicle?.small_bags_capacity || '',
        doors: vehicle?.doors || '',
        ac: vehicle?.ac || true as boolean,
        gears: vehicle?.gears || '',
        hp: vehicle?.hp || '',
        base_price: vehicle?.base_price || '',
        vin: vehicle?.vin || '',
        fuel_type: vehicle?.fuel_type || '',
        transmission: vehicle?.transmission || '',
        status: vehicle?.status || 'available',
        current_km: vehicle?.current_km || '0',
    });

    useEffect(() => {
        if (!selectedMakeId) {
            setAvailableModels([]);
            form.setData('vehicle_model_id', '');
            return;
        }

        const controller = new AbortController();
        setLoadingModels(true);

        fetch(`/api/vehicle-models?make_id=${selectedMakeId}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((data: VehicleModel[]) => {
                setAvailableModels(data);
                const currentModelId = String(form.data.vehicle_model_id);
                const modelExists = data.some((m) => String(m.id) === currentModelId);
                if (!modelExists) {
                    form.setData('vehicle_model_id', '');
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') throw err;
            })
            .finally(() => setLoadingModels(false));

        return () => controller.abort();
    }, [selectedMakeId]);

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isEdit && vehicle?.id) {
            form.submit(update(vehicle.id), {});
        } else {
            form.submit(store(), {
                onSuccess: () => {
                    form.reset();
                    setSelectedMakeId("");
                }
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Μάρκα / Μοντέλο */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Μάρκα</Label>
                    <Select
                        value={selectedMakeId}
                        onValueChange={setSelectedMakeId}
                        defaultValue={String(vehicle?.vehicle_model?.vehicle_make_id)}
                    >
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
                        value={String(form.data.vehicle_model_id)}
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
                <Select value={String(form.data.vehicle_category_id)} onValueChange={(v) => form.setData('vehicle_category_id', v)}>
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

            {/* Τιμή / Χιλιόμετρα / Κατάσταση */}
            <div className="grid grid-cols-3 gap-4">
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
                <div className="space-y-2">
                    <Label>Κατάσταση</Label>
                    <Select value={form.data.status} onValueChange={(v) => form.setData('status', v as STATUS)}>
                        <SelectTrigger><SelectValue placeholder="Επιλέξτε κατάσταση" /></SelectTrigger>
                        <SelectContent>
                            {VEHICLE_STATUSES.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.status} />
                </div>
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={form.processing}>{isEdit ? 'Ανανέωση' : 'Αποθήκευση'}</Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>Ακύρωση</Button>
            </div>
        </form>
    )
}

export default VehicleForm