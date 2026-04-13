import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title:    string
  value:    string | number
  subtitle?: string
  icon:     LucideIcon
  trend?:   { value: number; label: string }
  variant?: 'default' | 'gold' | 'success' | 'info' | 'danger'
  loading?: boolean
}

const variantStyles = {
  default: {
    card:    'border-brand-border bg-brand-card hover:border-brand-border/80',
    icon:    'bg-brand-surface text-muted-foreground',
    trend:   'text-muted-foreground',
  },
  danger: {
    card:    'border-status-danger/25 bg-gradient-to-br from-brand-card to-status-danger/5 hover:border-status-danger/40',
    icon:    'bg-status-danger/15 text-status-danger',
    trend:   'text-status-danger',
  },
  gold: {
    card:    'border-brand-gold/25 bg-gradient-to-br from-brand-card to-brand-gold/5 hover:border-brand-gold/40',
    icon:    'bg-brand-gold/15 text-brand-gold',
    trend:   'text-brand-gold',
  },
  success: {
    card:    'border-status-active/25 bg-gradient-to-br from-brand-card to-status-active/5 hover:border-status-active/40',
    icon:    'bg-status-active/15 text-status-active',
    trend:   'text-status-active',
  },
  info: {
    card:    'border-status-info/25 bg-gradient-to-br from-brand-card to-status-info/5 hover:border-status-info/40',
    icon:    'bg-status-info/15 text-status-info',
    trend:   'text-status-info',
  },
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, variant = 'default', loading }: KPICardProps) {
  const styles = variantStyles[variant]

  if (loading) {
    return (
      <Card className="border-brand-border bg-brand-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5', styles.card)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="font-heading text-3xl font-semibold text-foreground mt-1.5 leading-none">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
            )}
            {trend && (
              <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', styles.trend)}>
                <span>{trend.value > 0 ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}% {trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('p-2.5 rounded-xl shrink-0', styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
