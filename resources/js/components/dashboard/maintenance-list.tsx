import { Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MaintenanceVehicle } from '@/types/dashboard';

function vehicleLabel(m: MaintenanceVehicle): string {
    const v = m.vehicle;
    if (!v) return '—';
    const model = v.vehicle_model;
    const parts = [model?.make?.name, model?.name].filter(Boolean).join(' ');
    return parts ? `${parts} (${v.plate_number})` : v.plate_number;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function MaintenanceList({ vehicles }: { vehicles: MaintenanceVehicle[] }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Wrench className="size-4 text-amber-500" />
                    Οχήματα σε Συντήρηση
                </CardTitle>
            </CardHeader>
            <CardContent>
                {vehicles.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">Κανένα όχημα σε συντήρηση.</p>
                ) : (
                    <div className="space-y-3">
                        {vehicles.map((m) => (
                            <div key={m.id} className="flex items-start justify-between rounded-lg border p-3">
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="truncate text-sm font-medium">{vehicleLabel(m)}</p>
                                    <p className="text-sm text-muted-foreground">{m.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{formatDate(m.start_date)}</span>
                                        <span>→</span>
                                        <span>{m.end_date ? formatDate(m.end_date) : 'Σε εξέλιξη'}</span>
                                    </div>
                                </div>
                                <div className="ml-3 flex flex-col items-end gap-1.5">
                                    <Badge variant={m.end_date ? 'outline' : 'destructive'} className="text-[10px]">
                                        {m.end_date ? 'Προγραμματισμένη' : 'Σε εξέλιξη'}
                                    </Badge>
                                    <span className="text-xs font-medium tabular-nums">{parseFloat(m.cost).toFixed(2)}&euro;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
