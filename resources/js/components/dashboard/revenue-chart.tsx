import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RevenueMonth } from '@/types/dashboard';

const MONTH_LABELS = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιούν', 'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'];

export default function RevenueChart({ data }: { data: RevenueMonth[] }) {
    const [fromIdx, setFromIdx] = useState(0);
    const [toIdx, setToIdx] = useState(data.length - 1);

    const filtered = useMemo(() => data.slice(fromIdx, toIdx + 1), [data, fromIdx, toIdx]);
    const total = useMemo(() => filtered.reduce((sum, d) => sum + d.revenue, 0), [filtered]);

    function handleFrom(val: string) {
        const idx = Number(val);
        setFromIdx(idx);
        if (idx > toIdx) setToIdx(idx);
    }

    function handleTo(val: string) {
        const idx = Number(val);
        setToIdx(idx);
        if (idx < fromIdx) setFromIdx(idx);
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardDescription>Επισκόπηση Εσόδων</CardDescription>
                        <CardTitle className="text-2xl tabular-nums">
                            {total.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={String(fromIdx)} onValueChange={handleFrom}>
                            <SelectTrigger className="h-8 w-[90px] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTH_LABELS.map((label, i) => (
                                    <SelectItem key={i} value={String(i)}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground">—</span>
                        <Select value={String(toIdx)} onValueChange={handleTo}>
                            <SelectTrigger className="h-8 w-[90px] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTH_LABELS.map((label, i) => (
                                    <SelectItem key={i} value={String(i)}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filtered} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
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
