'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PLEDGE_TYPES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'

const COLORS = ['#c9a84c', '#e8c97a', '#4caf88', '#5c9de0', '#a78bcf']

// Placeholder data
const data = PLEDGE_TYPES.map((pt, i) => ({
  name:     pt.label,
  ahadi:    [1200000, 450000, 800000, 600000, 950000][i],
  malipo:   [750000, 300000, 550000, 350000, 700000][i],
}))

interface PledgeSummaryChartProps { loading?: boolean }

export function PledgeSummaryChart({ loading }: PledgeSummaryChartProps) {
  if (loading) {
    return (
      <Card className="border-brand-border bg-brand-card">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-brand-border bg-brand-card">
      <CardHeader>
        <CardTitle>Muhtasari wa Ahadi</CardTitle>
        <CardDescription>Ahadi zilizowekwa dhidi ya zilizolipwa</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(46,43,62,0.5)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#6b6880' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6b6880' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                background: '#211f30',
                border: '1px solid #2e2b3e',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#e8c97a', fontWeight: 600 }}
              itemStyle={{ color: '#e0dde8' }}
              formatter={(value) => [formatCurrency(value as number), '']}
            />
            <Bar dataKey="ahadi" name="Ahadi" radius={[4, 4, 0, 0]} fill="#2e2b3e">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.5} />
              ))}
            </Bar>
            <Bar dataKey="malipo" name="Malipo" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-3 justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-4 rounded-sm bg-brand-gold/50" />
            <span>Ahadi</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-4 rounded-sm bg-brand-gold" />
            <span>Malipo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
