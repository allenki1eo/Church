'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Member } from '@/supabase/types'

interface UseMembersOptions {
  churchId?: string
  status?:   string
  search?:   string
  limit?:    number
}

export function useMembers(options: UseMembersOptions = {}) {
  const [members, setMembers]   = useState<Member[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [total, setTotal]       = useState(0)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase.from('members').select('*', { count: 'exact' })

      if (options.churchId) query = query.eq('church_id', options.churchId)
      if (options.status)   query = query.eq('status', options.status)
      if (options.search)   query = query.ilike('full_name', `%${options.search}%`)
      if (options.limit)    query = query.limit(options.limit)

      query = query.order('full_name', { ascending: true })

      const { data, error: err, count } = await query

      if (err) throw err
      setMembers(data ?? [])
      setTotal(count ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hitilafu imetokea')
    } finally {
      setLoading(false)
    }
  }, [options.churchId, options.status, options.search, options.limit])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  return { members, loading, error, total, refetch: fetchMembers }
}

export function useMember(id: string) {
  const [member, setMember]   = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function fetchMember() {
      setLoading(true)
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single()

      if (err) setError(err.message)
      else setMember(data)
      setLoading(false)
    }

    if (id) fetchMember()
  }, [id])

  return { member, loading, error }
}
