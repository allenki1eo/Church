import { Users, Wallet, TrendingUp, CalendarCheck } from 'lucide-react'
import { createServerClient, getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { KPICard } from '@/components/dashboard/KPICard'
import { MemberGrowthChart } from '@/components/dashboard/MemberGrowthChart'
import { PledgeSummaryChart } from '@/components/dashboard/PledgeSummaryChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { formatCurrency } from '@/lib/utils/formatters'

async function getDashboardData(churchId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient() as any

  const [membersRes, pledgesRes, servicesRes, financialsRes] = await Promise.all([
    supabase.from('members').select('id, status', { count: 'exact' }).eq('church_id', churchId).eq('status', 'active'),
    supabase.from('pledges').select('amount_pledged, amount_paid').eq('church_id', churchId).eq('year', new Date().getFullYear()),
    supabase.from('services').select('id', { count: 'exact' }).eq('church_id', churchId).gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
    supabase.from('financials').select('amount, type').eq('church_id', churchId).gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
  ])

  const totalMembers    = membersRes.count ?? 0
  const totalPledged    = (pledgesRes.data ?? []).reduce((sum: number, p: { amount_pledged: number }) => sum + (p.amount_pledged ?? 0), 0)
  const totalPaid       = (pledgesRes.data ?? []).reduce((sum: number, p: { amount_paid: number }) => sum + (p.amount_paid ?? 0), 0)
  const servicesCount   = servicesRes.count ?? 0
  const incomeThisMonth = (financialsRes.data ?? []).filter((f: { type: string }) => f.type === 'income').reduce((sum: number, f: { amount: number }) => sum + (f.amount ?? 0), 0)

  return { totalMembers, totalPledged, totalPaid, servicesCount, incomeThisMonth }
}

export default async function DashboardPage() {
  const profile  = await getProfile()
  const churchId = profile?.church_id

  let data = { totalMembers: 0, totalPledged: 0, totalPaid: 0, servicesCount: 0, incomeThisMonth: 0 }
  if (churchId) {
    try {
      data = await getDashboardData(churchId)
    } catch { /* Supabase not configured yet */ }
  }

  const fulfillmentRate = data.totalPledged > 0
    ? Math.round((data.totalPaid / data.totalPledged) * 100)
    : 0

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Habari, ${profile?.full_name?.split(' ')[0] ?? 'Karibu'}`}
        description="Muhtasari wa hali ya kanisa leo"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Wanachama Wanaofanya Kazi"
          value={data.totalMembers.toLocaleString()}
          icon={Users}
          variant="info"
          subtitle="Wanachama wote wanaofanya kazi"
          trend={{ value: 3.2, label: 'mwezi huu' }}
        />
        <KPICard
          title="Jumla ya Ahadi (Mwaka)"
          value={formatCurrency(data.totalPledged)}
          icon={TrendingUp}
          variant="gold"
          subtitle={`${fulfillmentRate}% imekamilika`}
        />
        <KPICard
          title="Malipo Yaliyopokelewa"
          value={formatCurrency(data.totalPaid)}
          icon={Wallet}
          variant="success"
          subtitle="Mwaka huu"
        />
        <KPICard
          title="Ibada Mwezi Huu"
          value={data.servicesCount}
          icon={CalendarCheck}
          variant="default"
          subtitle={`Mapato: ${formatCurrency(data.incomeThisMonth)}`}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemberGrowthChart />
        <PledgeSummaryChart />
      </div>

      {/* Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <div className="rounded-xl border border-brand-border bg-brand-card p-5 space-y-4">
            <h3 className="font-heading text-base font-semibold">Ahadi kwa Aina</h3>
            {[
              { label: 'Jengo',         pct: 62 },
              { label: 'Ahadi',         pct: 78 },
              { label: 'Mavuno',        pct: 85 },
              { label: 'Utumishi',      pct: 45 },
              { label: 'Ujenzi/Miradi', pct: 55 },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-brand-gold font-medium">{item.pct}%</span>
                </div>
                <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold to-brand-goldLight rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
