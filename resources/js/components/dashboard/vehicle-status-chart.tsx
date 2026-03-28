import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { VehicleStatusCounts } from '@/types/dashboard';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    available: { label: 'Διαθέσιμα', color: 'var(--chart-2)' },
    rented: { label: 'Ενοικιασμένα', color: 'var(--chart-1)' },
    maintenance: { label: 'Συντήρηση', color: 'var(--chart-4)' },
    out_of_service: { label: 'Εκτός λειτουργίας', color: 'var(--chart-5)' },
};

export default function VehicleStatusChart({ counts }: { counts: VehicleStatusCounts }) {
    const data = Object.entries(STATUS_CONFIG)
        .map(([key, config]) => ({
            name: config.label,
            value: counts[key as keyof VehicleStatusCounts] ?? 0,
            color: config.color,
        }))
        .filter((d) => d.value > 0);

    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>Κατάσταση Στόλου</CardDescription>
                <CardTitle className="text-2xl tabular-nums">{total} οχήματα</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                {data.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: 'var(--card-foreground)',
                                }}
                                formatter={(value, name) => [`${value} οχήματα`, name]}
                            />
                            <Legend
                                verticalAlign="bottom"
                                iconSize={8}
                                iconType="circle"
                                formatter={(value: string) => <span className="text-xs text-foreground">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
