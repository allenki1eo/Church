'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Financial, MonthlyFinancialRow } from '@/supabase/types'

export function useFinancials(churchId?: string, type?: 'income' | 'expense') {
  const [financials, setFinancials] = useState<Financial[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const fetchFinancials = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase
        .from('financials')
        .select('*')
        .order('date', { ascending: false })

      if (churchId) query = query.eq('church_id', churchId)
      if (type)     query = query.eq('type', type)

      const { data, error: err } = await query
      if (err) throw err
      setFinancials(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hitilafu imetokea')
    } finally {
      setLoading(false)
    }
  }, [churchId, type])

  useEffect(() => { fetchFinancials() }, [fetchFinancials])

  return { financials, loading, error, refetch: fetchFinancials }
}

export function useMonthlyFinancials(churchId?: string) {
  const [data, setData]       = useState<MonthlyFinancialRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const supabase = createClient()
      let query = supabase
        .from('monthly_financials')
        .select('*')
        .order('month', { ascending: false })

      if (churchId) query = query.eq('church_id', churchId)

      const { data: rows, error: err } = await query
      if (err) setError(err.message)
      else setData(rows ?? [])
      setLoading(false)
    }
    fetch()
  }, [churchId])

  return { data, loading, error }
}
