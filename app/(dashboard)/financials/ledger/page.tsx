import { Plus } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { LedgerTable } from '@/components/financials/LedgerTable'
import { Button } from '@/components/ui/button'
import { KPICard } from '@/components/dashboard/KPICard'
import { formatCurrency } from '@/lib/utils/formatters'
import { ArrowUpRight, ArrowDownLeft, Scale } from 'lucide-react'
import type { Financial } from '@/supabase/types'
import { NewFinancialDialog } from '@/components/financials/NewFinancialDialog'

export const metadata = { title: 'Daftari la Fedha' }

export default async function LedgerPage() {
  const profile  = await getProfile()
  const churchId = profile?.church_id
  let financials: Financial[] = []

  if (churchId) {
    try {
      const supabase = createServerClient()
      const { data } = await supabase
        .from('financials')
        .select('*')
        .eq('church_id', churchId)
        .order('date', { ascending: false })

      financials = data ?? []
    } catch { /* */ }
  }

  const income  = financials.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0)
  const expense = financials.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0)
  const net     = income - expense

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftari la Fedha"
        description="Rekodi za mapato na matumizi"
        action={
          churchId
            ? <NewFinancialDialog churchId={churchId} />
            : null
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="Mapato Yote"  value={formatCurrency(income)}  icon={ArrowUpRight}  variant="success" />
        <KPICard title="Matumizi Yote" value={formatCurrency(expense)} icon={ArrowDownLeft} variant="danger" />
        <KPICard
          title="Bakaa"
          value={formatCurrency(net)}
          icon={Scale}
          variant={net >= 0 ? 'gold' : 'default'}
          subtitle={net >= 0 ? 'Faida' : 'Hasara'}
        />
      </div>

      <LedgerTable financials={financials} />
    </div>
  )
}
