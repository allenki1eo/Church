import { FileText, Download } from 'lucide-react'
import { createServerClient, getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Users, Wallet, Calendar } from 'lucide-react'

export const metadata = { title: 'Ripoti' }

export default async function ReportsPage() {
  const profile  = await getProfile()
  const churchId = profile?.church_id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createServerClient() as any

  const stats = {
    totalMembers:  0,
    activeMembers: 0,
    totalPledged:  0,
    totalPaid:     0,
    servicesCount: 0,
    incomeTotal:   0,
    expenseTotal:  0,
  }

  if (churchId) {
    try {
      const [membersRes, pledgesRes, servicesRes, financialsRes] = await Promise.all([
        sb.from('members').select('status',                { count: 'exact' }).eq('church_id', churchId),
        sb.from('pledges').select('amount_pledged, amount_paid').eq('church_id', churchId),
        sb.from('services').select('id',                  { count: 'exact' }).eq('church_id', churchId),
        sb.from('financials').select('type, amount').eq('church_id', churchId),
      ])

      stats.totalMembers  = membersRes.count ?? 0
      stats.activeMembers = (membersRes.data ?? []).filter((m: { status: string }) => m.status === 'active').length
      stats.totalPledged  = (pledgesRes.data ?? []).reduce((s: number, p: { amount_pledged: number }) => s + (p.amount_pledged ?? 0), 0)
      stats.totalPaid     = (pledgesRes.data ?? []).reduce((s: number, p: { amount_paid: number }) => s + (p.amount_paid ?? 0), 0)
      stats.servicesCount = servicesRes.count ?? 0
      stats.incomeTotal   = (financialsRes.data ?? []).filter((f: { type: string }) => f.type === 'income').reduce((s: number, f: { amount: number }) => s + f.amount, 0)
      stats.expenseTotal  = (financialsRes.data ?? []).filter((f: { type: string }) => f.type === 'expense').reduce((s: number, f: { amount: number }) => s + f.amount, 0)
    } catch { /* */ }
  }

  const REPORT_TYPES = [
    {
      title:       'Ripoti ya Wanachama',
      description: 'Orodha ya wanachama wote, hali ya uanachama, na taarifa za kimsingi',
      icon:        Users,
      badge:       'PDF / Excel',
    },
    {
      title:       'Ripoti ya Ahadi',
      description: 'Muhtasari wa ahadi zote, malipo, na mabaki kwa kila mwanachama',
      icon:        Wallet,
      badge:       'PDF / Excel',
    },
    {
      title:       'Ripoti ya Fedha ya Wiki',
      description: 'Mapato na matumizi ya wiki — sadaka, zaka, na matoleo mengine',
      icon:        FileText,
      badge:       'PDF',
    },
    {
      title:       'Ripoti ya Ibada',
      description: 'Orodha ya ibada na matukio, wahubiri, na idadi ya washiriki',
      icon:        Calendar,
      badge:       'PDF',
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Ripoti" description="Tengeneza na pakua ripoti za kanisa" />

      {/* Quick stats */}
      <div className="rounded-xl border border-brand-gold/20 bg-gradient-to-br from-brand-card to-brand-gold/5 p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Muhtasari wa Kanisa</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Wanachama Wote',            value: stats.totalMembers.toLocaleString() },
            { label: 'Wanachama Wanaofanya Kazi', value: stats.activeMembers.toLocaleString() },
            { label: 'Jumla ya Ahadi',            value: formatCurrency(stats.totalPledged) },
            { label: 'Jumla ya Mapato',           value: formatCurrency(stats.incomeTotal) },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-heading text-2xl font-semibold text-brand-gold">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORT_TYPES.map((report) => (
          <Card key={report.title} className="border-brand-border bg-brand-card hover:border-brand-gold/30 transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
                  <report.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px]">{report.badge}</Badge>
              </div>
              <CardTitle className="text-base mt-3">{report.title}</CardTitle>
              <CardDescription className="text-xs">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3.5 w-3.5 mr-2" />Pakua PDF
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Download className="h-3.5 w-3.5 mr-2" />Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="bg-brand-border" />

      {/* Weekly Report Preview */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold">Muhtasari wa Wiki Hii</h2>
        <div className="rounded-xl border border-brand-border bg-brand-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-semibold">Ripoti ya Wiki</h3>
              <p className="text-xs text-muted-foreground">{formatDate(new Date().toISOString())}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5 mr-2" />Chapisha
            </Button>
          </div>
          <Separator className="bg-brand-border" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Wanachama',          value: stats.activeMembers },
              { label: 'Ibada',              value: stats.servicesCount },
              { label: 'Mapato',             value: formatCurrency(stats.incomeTotal) },
              { label: 'Matumizi',           value: formatCurrency(stats.expenseTotal) },
              { label: 'Bakaa',              value: formatCurrency(stats.incomeTotal - stats.expenseTotal) },
              { label: 'Ahadi Zilizolipwa',  value: formatCurrency(stats.totalPaid) },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-heading font-semibold text-lg text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
