'use client'

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDateShort } from '@/lib/utils/formatters'
import { ALL_FINANCIAL_CATEGORIES, FINANCIAL_INCOME_CATEGORIES } from '@/lib/constants'
import type { Financial } from '@/supabase/types'
import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface LedgerTableProps {
  financials: Financial[]
  loading?:   boolean
}

export function LedgerTable({ financials, loading }: LedgerTableProps) {
  const totalIncome  = financials.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0)
  const totalExpense = financials.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0)
  const net          = totalIncome - totalExpense

  if (loading) {
    return (
      <div className="rounded-xl border border-brand-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-brand-border bg-brand-surface/50">
              {['Tarehe', 'Aina', 'Kategoria', 'Maelezo', 'Kiasi'].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-brand-border/50">
                <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-3 w-24" /></TableCell>
                <TableCell><Skeleton className="h-3 w-32" /></TableCell>
                <TableCell><Skeleton className="h-3 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!financials.length) {
    return (
      <div className="rounded-xl border border-brand-border bg-brand-card flex items-center justify-center py-14">
        <p className="text-muted-foreground text-sm">Hakuna rekodi za fedha zilizopatikana</p>
      </div>
    )
  }

  const incomeCategories = new Set(FINANCIAL_INCOME_CATEGORIES.map(c => c.value))

  return (
    <div className="rounded-xl border border-brand-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-brand-border bg-brand-surface/50 hover:bg-brand-surface/50">
            <TableHead className="text-xs uppercase tracking-wider">Tarehe</TableHead>
            <TableHead className="text-xs uppercase tracking-wider">Aina</TableHead>
            <TableHead className="text-xs uppercase tracking-wider hidden sm:table-cell">Kategoria</TableHead>
            <TableHead className="text-xs uppercase tracking-wider hidden md:table-cell">Maelezo</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-right">Kiasi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {financials.map((f) => {
            const isIncome = f.type === 'income'
            const catLabel = ALL_FINANCIAL_CATEGORIES.find(c => c.value === f.category)?.label ?? f.category
            return (
              <TableRow key={f.id} className="border-brand-border/40">
                <TableCell className="text-sm text-muted-foreground">{formatDateShort(f.date)}</TableCell>
                <TableCell>
                  <div className={cn(
                    'flex items-center gap-1.5 text-xs font-medium',
                    isIncome ? 'text-status-active' : 'text-status-danger',
                  )}>
                    {isIncome
                      ? <ArrowUpRight className="h-3.5 w-3.5" />
                      : <ArrowDownLeft className="h-3.5 w-3.5" />
                    }
                    {isIncome ? 'Mapato' : 'Matumizi'}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{catLabel}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{f.description ?? '—'}</TableCell>
                <TableCell className={cn(
                  'text-right font-mono text-sm font-semibold money-cell',
                  isIncome ? 'text-status-active' : 'text-status-danger',
                )}>
                  {isIncome ? '+' : '-'}{formatCurrency(f.amount)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow className="border-brand-border bg-brand-surface/30">
            <TableCell colSpan={4} className="text-sm font-semibold">Jumla</TableCell>
            <TableCell className={cn('text-right font-mono font-bold money-cell', net >= 0 ? 'text-status-active' : 'text-status-danger')}>
              {net >= 0 ? '+' : ''}{formatCurrency(net)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
