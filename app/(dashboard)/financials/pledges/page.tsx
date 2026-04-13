import { Plus } from 'lucide-react'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { PledgeProgress } from '@/components/financials/PledgeProgress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils/formatters'
import { KPICard } from '@/components/dashboard/KPICard'
import { TrendingUp, Wallet, CheckCircle } from 'lucide-react'

export const metadata = { title: 'Ahadi Zake' }

export default async function PledgesPage() {
  const profile  = await getProfile()
  const churchId = profile?.church_id

  let pledges: Awaited<ReturnType<ReturnType<typeof createServerClient>['from']>>['data'] = []
  let totalPledged = 0, totalPaid = 0, fulfilled = 0

  if (churchId) {
    try {
      const supabase = createServerClient()
      const { data } = await supabase
        .from('pledges')
        .select('*, members(full_name, badge_number)')
        .eq('church_id', churchId)
        .order('created_at', { ascending: false })

      pledges = data ?? []
      totalPledged = pledges.reduce((s: number, p: { amount_pledged: number }) => s + (p.amount_pledged ?? 0), 0)
      totalPaid    = pledges.reduce((s: number, p: { amount_paid: number }) => s + (p.amount_paid ?? 0), 0)
      fulfilled    = pledges.filter((p: { status: string }) => p.status === 'fulfilled').length
    } catch { /* */ }
  }

  const pct = totalPledged > 0 ? Math.round((totalPaid / totalPledged) * 100) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ahadi Zake"
        description="Ahadi za wanachama na hali ya malipo"
        action={
          <Button asChild variant="gold" size="sm">
            <Link href="/dashboard/financials/payments">
              <Plus className="h-4 w-4 mr-2" />
              Rekodi Malipo
            </Link>
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="Jumla ya Ahadi"    value={formatCurrency(totalPledged)} icon={TrendingUp} variant="gold" />
        <KPICard title="Kilicholipwa"      value={formatCurrency(totalPaid)}    icon={Wallet}     variant="success" subtitle={`${pct}% ya ahadi zote`} />
        <KPICard title="Ahadi Zilizokamilika" value={fulfilled}                 icon={CheckCircle} variant="info" />
      </div>

      {/* Pledge list */}
      {Array.isArray(pledges) && pledges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(pledges as Array<Record<string, unknown>>).map((pledge) => (
            <div key={pledge.id as string} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {(pledge.members as { full_name: string } | null)?.full_name ?? 'Mwanachama'}
                </p>
                {(pledge.members as { badge_number?: string } | null)?.badge_number && (
                  <span className="text-[10px] text-brand-gold font-mono">
                    {(pledge.members as { badge_number: string }).badge_number}
                  </span>
                )}
              </div>
              <PledgeProgress pledge={pledge as Parameters<typeof PledgeProgress>[0]['pledge']} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-brand-border bg-brand-card flex items-center justify-center py-16">
          <p className="text-muted-foreground text-sm">Hakuna ahadi zilizorekodiwa</p>
        </div>
      )}
    </div>
  )
}
