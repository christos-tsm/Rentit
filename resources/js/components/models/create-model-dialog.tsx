import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { store } from "@/actions/App/Http/Controllers/VehicleModelController";
import { VehicleMake } from "@/types/admin";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function CreateModelDialog({ makes = [] }: { makes: VehicleMake[] }) {
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