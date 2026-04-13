import { createServerClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { NewPaymentDialog } from '@/components/financials/NewPaymentDialog'
import { formatCurrency, formatDateShort } from '@/lib/utils/formatters'
import { PLEDGE_TYPES, PAYMENT_METHODS } from '@/lib/constants'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Malipo ya Ahadi' }

export default async function PaymentsPage() {
  const profile  = await getProfile()
  const churchId = profile?.church_id
  let payments: Array<Record<string, unknown>> = []
  let pledges:  Array<Record<string, unknown>> = []

  if (churchId) {
    try {
      const supabase = createServerClient()
      const [paymentsRes, pledgesRes] = await Promise.all([
        supabase
          .from('pledge_payments')
          .select('*, pledges(pledge_type, amount_pledged, members(full_name))')
          .order('payment_date', { ascending: false })
          .limit(100),
        supabase
          .from('pledges')
          .select('id, pledge_type, amount_pledged, balance, members(full_name)')
          .eq('church_id', churchId)
          .eq('status', 'active'),
      ])
      payments = (paymentsRes.data ?? []) as Array<Record<string, unknown>>
      pledges  = (pledgesRes.data ?? []) as Array<Record<string, unknown>>
    } catch { /* */ }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Malipo ya Ahadi"
        description="Rekodi malipo ya ahadi za wanachama"
        action={
          churchId ? <NewPaymentDialog pledges={pledges} /> : null
        }
      />

      <div className="rounded-xl border border-brand-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-brand-border bg-brand-surface/50 hover:bg-brand-surface/50">
              <TableHead className="text-xs uppercase tracking-wider">Tarehe</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Mwanachama</TableHead>
              <TableHead className="text-xs uppercase tracking-wider hidden sm:table-cell">Aina ya Ahadi</TableHead>
              <TableHead className="text-xs uppercase tracking-wider hidden md:table-cell">Njia ya Malipo</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-right">Kiasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  Hakuna malipo yaliyorekodiwa
                </TableCell>
              </TableRow>
            ) : payments.map((pay) => {
              const pledge = pay.pledges as Record<string, unknown> | null
              const member = pledge ? (pledge.members as { full_name: string } | null) : null
              const methodLabel = PAYMENT_METHODS.find(m => m.value === pay.payment_method)?.label ?? (pay.payment_method as string)
              const typeLabel   = PLEDGE_TYPES.find(t => t.value === (pledge?.pledge_type))?.label ?? ''
              return (
                <TableRow key={pay.id as string} className="border-brand-border/40">
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateShort(pay.payment_date as string)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{member?.full_name ?? '—'}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{typeLabel}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">{methodLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold text-status-active money-cell">
                    +{formatCurrency(pay.amount as number)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
