'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pledge, PledgeSummaryRow } from '@/supabase/types'

export function usePledges(churchId?: string, memberId?: string) {
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchPledges = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase
        .from('pledges')
        .select('*')
        .order('created_at', { ascending: false })

      if (churchId) query = query.eq('church_id', churchId)
      if (memberId) query = query.eq('member_id', memberId)

      const { data, error: err } = await query
      if (err) throw err
      setPledges(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hitilafu imetokea')
    } finally {
      setLoading(false)
    }
  }, [churchId, memberId])

  useEffect(() => { fetchPledges() }, [fetchPledges])

  return { pledges, loading, error, refetch: fetchPledges }
}

export function usePledgeSummary(churchId?: string) {
  const [summary, setSummary] = useState<PledgeSummaryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true)
      const supabase = createClient()
      let query = supabase.from('pledge_summary').select('*')
      if (churchId) query = query.eq('church_id', churchId)

      const { data, error: err } = await query
      if (err) setError(err.message)
      else setSummary(data ?? [])
      setLoading(false)
    }
    fetchSummary()
  }, [churchId])

  return { summary, loading, error }
}
