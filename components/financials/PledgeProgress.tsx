import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, calcPercent } from '@/lib/utils/formatters'
import { PLEDGE_TYPES } from '@/lib/constants'
import type { Pledge } from '@/supabase/types'
import { cn } from '@/lib/utils'

interface PledgeProgressProps {
  pledge: Pledge
  compact?: boolean
}

const statusVariant: Record<string, 'active' | 'warning' | 'danger'> = {
  active:    'active',
  fulfilled: 'active',
  defaulted: 'danger',
}

export function PledgeProgress({ pledge, compact }: PledgeProgressProps) {
  const label   = PLEDGE_TYPES.find(p => p.value === pledge.pledge_type)?.label ?? pledge.pledge_type
  const pct     = calcPercent(pledge.amount_paid, pledge.amount_pledged)
  const variant = statusVariant[pledge.status] ?? 'active'

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className="text-xs text-brand-gold font-medium">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5 bg-brand-border [&>div]:bg-gradient-to-r [&>div]:from-brand-gold [&>div]:to-brand-goldLight" />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-brand-border bg-brand-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
            {pledge.year} · {pledge.frequency ?? 'mara moja'}
          </p>
        </div>
        <Badge variant={variant} className="shrink-0">
          {pledge.status === 'fulfilled' ? 'Imekamilika' : pledge.status === 'defaulted' ? 'Imeshindwa' : 'Inaendelea'}
        </Badge>
      </div>

      <Progress
        value={pct}
        className="h-2 bg-brand-border [&>div]:bg-gradient-to-r [&>div]:from-brand-gold [&>div]:to-brand-goldLight"
      />

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground">Ahadi</p>
          <p className="text-xs font-semibold text-foreground money-cell">
            {formatCurrency(pledge.amount_pledged)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Imelipwa</p>
          <p className="text-xs font-semibold text-status-active money-cell">
            {formatCurrency(pledge.amount_paid)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Baki</p>
          <p className={cn('text-xs font-semibold money-cell', pledge.balance > 0 ? 'text-status-danger' : 'text-status-active')}>
            {formatCurrency(pledge.balance ?? 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
