'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Church, Profile } from '@/supabase/types'

export function useChurch() {
  const [church, setChurch]   = useState<Church | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function fetchChurchData() {
      setLoading(true)
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profileData, error: profileErr } = await sb
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileErr) { setError(profileErr.message); setLoading(false); return }
      setProfile(profileData as Profile)

      if (profileData?.church_id) {
        const { data: churchData, error: churchErr } = await sb
          .from('church')
          .select('*')
          .eq('id', profileData.church_id)
          .single()

        if (churchErr) setError(churchErr.message)
        else setChurch(churchData as Church)
      }

      setLoading(false)
    }

    fetchChurchData()
  }, [])

  return { church, profile, loading, error }
}

export function useSubChurches(parentId?: string) {
  const [subChurches, setSubChurches] = useState<Church[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('church')
        .select('*')
        .eq('sub_church_of', parentId ?? '')

      setSubChurches((data ?? []) as Church[])
      setLoading(false)
    }
    if (parentId) fetch()
    else setLoading(false)
  }, [parentId])

  return { subChurches, loading }
}
