'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MemberForm } from '@/components/members/MemberForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useChurch } from '@/lib/hooks/useChurch'
import type { Member } from '@/supabase/types'
import type { MemberFormData } from '@/lib/validations/member.schema'

export default function EditMemberPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useChurch()
  const [member, setMember]   = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMember() {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('members')
        .select('*')
        .eq('id', params.id as string)
        .single()
      setMember(data as Member)
      setLoading(false)
    }
    fetchMember()
  }, [params.id])

  async function handleSubmit(data: MemberFormData) {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('members')
      .update(data)
      .eq('id', params.id as string)

    if (error) {
      alert(`Hitilafu: ${error.message}`)
      return
    }
    router.push(`/dashboard/members/${params.id}`)
    router.refresh()
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-xl border border-brand-border bg-brand-card p-8 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!member || !profile?.church_id) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/dashboard/members/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title="Hariri Mwanachama"
          description={member.full_name}
        />
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-6 md:p-8">
        <MemberForm
          churchId={profile.church_id}
          defaultValues={member as Partial<MemberFormData>}
          onSubmit={handleSubmit}
          isEdit
        />
      </div>
    </div>
  )
}
