import { Badge } from '@/components/ui/badge'
import { MEMBER_STATUSES } from '@/lib/constants'
import type { BadgeProps } from '@/components/ui/badge'

const statusVariant: Record<string, BadgeProps['variant']> = {
  active:          'active',
  transferred_in:  'info',
  transferred_out: 'warning',
  returned:        'info',
  guest:           'secondary',
  deceased:        'danger',
  inactive:        'secondary',
}

interface MemberStatusBadgeProps { status: string }

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  const label   = MEMBER_STATUSES.find(s => s.value === status)?.label ?? status
  const variant = statusVariant[status] ?? 'secondary'
  return <Badge variant={variant}>{label}</Badge>
}
