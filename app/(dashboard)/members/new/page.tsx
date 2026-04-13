'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MemberForm } from '@/components/members/MemberForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useChurch } from '@/lib/hooks/useChurch'
import type { MemberFormData } from '@/lib/validations/member.schema'

export default function NewMemberPage() {
  const router = useRouter()
  const { profile } = useChurch()

  async function handleSubmit(data: MemberFormData) {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('members') as any).insert({
      ...data,
      created_by: profile?.id,
    })
    if (error) {
      alert(`Hitilafu: ${error.message}`)
      return
    }
    router.push('/dashboard/members')
    router.refresh()
  }

  if (!profile?.church_id) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground text-sm">
          Akaunti yako haijaunganishwa na kanisa. Wasiliana na Msimamizi.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/dashboard/members">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title="Andikisha Mwanachama"
          description="Jaza fomu ya Taarifa Binafsi kwa mwanachama mpya"
        />
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-6 md:p-8">
        <MemberForm
          churchId={profile.church_id}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
