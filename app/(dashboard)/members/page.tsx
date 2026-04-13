import Link from 'next/link'
import { Plus, Download } from 'lucide-react'
import { createServerClient, getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { MemberTable } from '@/components/members/MemberTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MEMBER_STATUSES } from '@/lib/constants'
import type { Member } from '@/supabase/types'

interface PageProps {
  searchParams: { status?: string; q?: string }
}

export const metadata = { title: 'Wanachama' }

export default async function MembersPage({ searchParams }: PageProps) {
  const profile   = await getProfile()
  const churchId  = profile?.church_id
  let members: Member[] = []
  let total = 0

  if (churchId) {
    try {
      const supabase = createServerClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase.from('members') as any).select('*', { count: 'exact' })
        .eq('church_id', churchId)
        .order('full_name', { ascending: true })

      if (searchParams.status) query = query.eq('status', searchParams.status)
      if (searchParams.q)      query = query.ilike('full_name', `%${searchParams.q}%`)

      const { data, count } = await query
      members = (data ?? []) as Member[]
      total   = count ?? 0
    } catch { /* Supabase not configured yet */ }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wanachama"
        description={`Wanachama ${total.toLocaleString()} wamepatikana`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Pakua
            </Button>
            <Button asChild variant="gold" size="sm">
              <Link href="/dashboard/members/new">
                <Plus className="h-4 w-4 mr-2" />
                Mwanachama Mpya
              </Link>
            </Button>
          </div>
        }
      />

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/members">
          <Badge
            variant={!searchParams.status ? 'gold' : 'outline'}
            className="cursor-pointer px-3 py-1 text-xs"
          >
            Wote
          </Badge>
        </Link>
        {MEMBER_STATUSES.map((s) => (
          <Link key={s.value} href={`/dashboard/members?status=${s.value}`}>
            <Badge
              variant={searchParams.status === s.value ? 'gold' : 'outline'}
              className="cursor-pointer px-3 py-1 text-xs"
            >
              {s.label}
            </Badge>
          </Link>
        ))}
      </div>

      <MemberTable members={members} />
    </div>
  )
}
