'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Placeholder data — replace with real Supabase data
const data = [
  { month: 'Jul',  wanachama: 210 },
  { month: 'Ago',  wanachama: 218 },
  { month: 'Sep',  wanachama: 225 },
  { month: 'Okt',  wanachama: 231 },
  { month: 'Nov',  wanachama: 238 },
  { month: 'Des',  wanachama: 245 },
  { month: 'Jan',  wanachama: 252 },
  { month: 'Feb',  wanachama: 260 },
  { month: 'Mar',  wanachama: 265 },
  { month: 'Apr',  wanachama: 271 },
  { month: 'Mei',  wanachama: 278 },
  { month: 'Jun',  wanachama: 285 },
]

interface MemberGrowthChartProps { loading?: boolean }

export function MemberGrowthChart({ loading }: MemberGrowthChartProps) {
  if (loading) {
    return (
      <Card className="border-brand-border bg-brand-card">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56 mt-1" />
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
        <CardTitle>Ukuaji wa Wanachama</CardTitle>
        <CardDescription>Mwaka wa fedha uliopita</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c9a84c" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(46,43,62,0.5)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6b6880' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b6880' }}
              axisLine={false}
              tickLine={false}
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
              formatter={(value) => [`${value} wanachama`, '']}
            />
            <Area
              type="monotone"
              dataKey="wanachama"
              stroke="#c9a84c"
              strokeWidth={2}
              fill="url(#goldGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#e8c97a', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
