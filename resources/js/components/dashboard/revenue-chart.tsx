import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RevenueMonth } from '@/types/dashboard';

export default function RevenueChart({ data }: { data: RevenueMonth[] }) {
    const total = data.reduce((sum, d) => sum + d.revenue, 0);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>Επισκόπηση Εσόδων</CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                    {total.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                            <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v: number) => `${v}€`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: 'var(--card-foreground)',
                                }}
                                formatter={(value) => [
                                    Number(value).toLocaleString('el-GR', { style: 'currency', currency: 'EUR' }),
                                    'Έσοδα',
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--chart-1)"
                                strokeWidth={2}
                                fill="url(#revenueGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
