import { Link } from '@inertiajs/react';
import { ArrowRight, Wrench } from 'lucide-react';
import { index as vehiclesIndex } from '@/routes/vehicles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MaintenanceData, MaintenanceVehicle } from '@/types/dashboard';

function vehicleLabel(v: MaintenanceVehicle): string {
    const model = v.vehicle_model;
    const parts = [model?.make?.name, model?.name].filter(Boolean).join(' ');
    return parts ? `${parts} (${v.plate_number})` : v.plate_number;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function MaintenanceList({ data }: { data: MaintenanceData }) {
    const { vehicles, total } = data;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Wrench className="size-4 text-amber-500" />
                    Οχήματα σε Συντήρηση
                    {total > 0 && (
                        <Badge variant="secondary" className="ml-1 text-[10px]">
                            {total}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {vehicles.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">Κανένα όχημα σε συντήρηση.</p>
                ) : (
                    <div className="space-y-3">
                        {vehicles.map((v) => {
                            const record = v.maintenances?.[0];
                            return (
                                <div key={v.id} className="flex items-start justify-between rounded-lg border p-3">
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <p className="truncate text-sm font-medium">{vehicleLabel(v)}</p>
                                        {record ? (
                                            <>
                                                <p className="text-sm text-muted-foreground">{record.description}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{formatDate(record.start_date)}</span>
                                                    <span>→</span>
                                                    <span>{record.end_date ? formatDate(record.end_date) : 'Σε εξέλιξη'}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Χωρίς λεπτομέρειες συντήρησης</p>
                                        )}
                                    </div>
                                    {record && (
                                        <div className="ml-3 flex flex-col items-end gap-1.5">
                                            <Badge variant={record.end_date ? 'outline' : 'destructive'} className="text-[10px]">
                                                {record.end_date ? 'Προγραμματισμένη' : 'Σε εξέλιξη'}
                                            </Badge>
                                            <span className="text-xs font-medium tabular-nums">{parseFloat(record.cost).toFixed(2)}&euro;</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
            {total > vehicles.length && (
                <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link href={`${vehiclesIndex().url}?status=maintenance`}>
                            Προβολή όλων ({total})
                            <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
