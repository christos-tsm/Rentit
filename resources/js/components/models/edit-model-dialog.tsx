import { useState } from "react";
import { update } from '@/actions/App/Http/Controllers/VehicleModelController';
import { VehicleMake, VehicleModel } from "@/types/admin";
import { useForm } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";


export function EditModelDialog({ model, makes }: { model: VehicleModel; makes: VehicleMake[] }) {
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
                                    {makes?.map((make) => (
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
