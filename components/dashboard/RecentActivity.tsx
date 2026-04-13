import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { UserPlus, CreditCard, Calendar, TrendingUp } from 'lucide-react'
import { formatDateShort } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'

type ActivityType = 'member' | 'payment' | 'service' | 'financial'

interface Activity {
  id:      string
  type:    ActivityType
  title:   string
  subtitle: string
  date:    string
  badge?:  string
}

const DEMO_ACTIVITIES: Activity[] = [
  { id: '1', type: 'member',    title: 'Mwanachama Mpya',        subtitle: 'Thomas Baraka Minja ameandikishwa', date: new Date().toISOString(), badge: 'Mpya' },
  { id: '2', type: 'payment',   title: 'Malipo ya Ahadi',         subtitle: 'Maria Yohana — TZS 150,000',       date: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', type: 'service',   title: 'Ibada ya Jumapili',       subtitle: 'Washiriki 142 walihudhuria',        date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '4', type: 'financial', title: 'Sadaka Imeingizwa',       subtitle: 'TZS 850,000 — Ibada ya Jumapili',  date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '5', type: 'member',    title: 'Mwanachama Amehamia',     subtitle: 'Grace Philip Nkembo amehamia',      date: new Date(Date.now() - 86400000 * 4).toISOString(), badge: 'Hamia' },
]

const iconMap: Record<ActivityType, { icon: typeof UserPlus; color: string }> = {
  member:    { icon: UserPlus,    color: 'text-status-info bg-status-info/15' },
  payment:   { icon: CreditCard,  color: 'text-status-active bg-status-active/15' },
  service:   { icon: Calendar,    color: 'text-brand-gold bg-brand-gold/15' },
  financial: { icon: TrendingUp,  color: 'text-status-warning bg-status-warning/15' },
}

interface RecentActivityProps { loading?: boolean }

export function RecentActivity({ loading }: RecentActivityProps) {
  if (loading) {
    return (
      <Card className="border-brand-border bg-brand-card">
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-brand-border bg-brand-card">
      <CardHeader>
        <CardTitle>Shughuli za Hivi Karibuni</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {DEMO_ACTIVITIES.map((activity, idx) => {
          const { icon: Icon, color } = iconMap[activity.type]
          return (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-brand-surface/50',
                idx < DEMO_ACTIVITIES.length - 1 && 'border-b border-brand-border/30',
              )}
            >
              <div className={cn('p-2 rounded-lg shrink-0', color)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground leading-none">{activity.title}</p>
                  {activity.badge && (
                    <Badge variant="gold" className="text-[10px] px-1.5 py-0">{activity.badge}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.subtitle}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 pt-0.5">
                {formatDateShort(activity.date)}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
