import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit, Phone, MapPin, Calendar,
  User, Heart, Church,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MemberStatusBadge } from '@/components/members/MemberStatusBadge'
import { CategoryTags } from '@/components/members/CategoryTags'
import { formatDate, initials } from '@/lib/utils/formatters'
import {
  GENDER_OPTIONS, MARITAL_STATUSES, EDUCATION_LEVELS,
} from '@/lib/constants'
import type { Member, MemberCategory, Pledge } from '@/supabase/types'

export const metadata = { title: 'Wasifu wa Mwanachama' }

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <dt className="text-xs text-muted-foreground min-w-[140px]">{label}</dt>
      <dd className="text-sm text-foreground font-medium">{value ?? '—'}</dd>
    </div>
  )
}

export default async function MemberProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const [memberRes, categoriesRes, pledgesRes] = await Promise.all([
    sb.from('members').select('*').eq('id', params.id).single(),
    sb.from('member_categories').select('*').eq('member_id', params.id),
    sb.from('pledges').select('*').eq('member_id', params.id),
  ])

  if (memberRes.error || !memberRes.data) notFound()

  const member     = memberRes.data   as Member
  const categories = (categoriesRes.data ?? []) as MemberCategory[]
  const pledges    = (pledgesRes.data ?? [])    as Pledge[]

  const genderLabel    = GENDER_OPTIONS.find(g => g.value === member.gender)?.label
  const maritalLabel   = MARITAL_STATUSES.find(m => m.value === member.marital_status)?.label
  const educationLabel = EDUCATION_LEVELS.find(e => e.value === member.education_level)?.label

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/dashboard/members"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold">Wasifu wa Mwanachama</h1>
        <div className="ml-auto">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/members/${member.id}/edit`}>
              <Edit className="h-3.5 w-3.5 mr-2" />
              Hariri
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero card */}
      <Card className="border-brand-gold/20 bg-gradient-to-br from-brand-card to-brand-gold/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 shrink-0 ring-4 ring-brand-gold/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={member.photo_url ?? ''} />
              <AvatarFallback className="font-heading text-2xl">{initials(member.full_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-heading text-2xl font-semibold text-foreground">{member.full_name}</h2>
              {member.badge_number && (
                <p className="text-sm text-brand-gold font-mono mt-0.5">{member.badge_number}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <MemberStatusBadge status={member.status} />
                {genderLabel && <span className="text-xs text-muted-foreground">• {genderLabel}</span>}
                {member.nationality && <span className="text-xs text-muted-foreground">• {member.nationality}</span>}
              </div>
              {categories.length > 0 && (
                <div className="mt-3">
                  <CategoryTags categories={categories} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-brand-border bg-brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Church className="h-4 w-4 text-brand-gold" />
                Uanachama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <InfoRow label="Tarehe ya Kujiunga"    value={formatDate(member.joined_date)} />
                <InfoRow label="Tarehe ya Ubatizo"     value={formatDate(member.baptism_date)} />
                <InfoRow label="Tarehe ya Uthibitisho" value={formatDate(member.confirmation_date)} />
              </dl>
            </CardContent>
          </Card>

          <Card className="border-brand-border bg-brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-brand-gold" />
                Taarifa Binafsi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <InfoRow label="Tarehe ya Kuzaliwa" value={formatDate(member.date_of_birth)} />
                <InfoRow label="Mahali pa Kuzaliwa" value={member.birthplace} />
                <InfoRow label="Kabila"              value={member.tribe} />
                <InfoRow label="Uraia"               value={member.nationality} />
              </dl>
            </CardContent>
          </Card>

          <Card className="border-brand-border bg-brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-gold" />
                Mawasiliano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <InfoRow label="Simu"     value={member.phone} />
                <InfoRow label="Makazi"   value={member.address} />
                <InfoRow label="Jumuiya"  value={member.community} />
              </dl>
            </CardContent>
          </Card>

          <Card className="border-brand-border bg-brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-brand-gold" />
                Elimu na Familia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <InfoRow label="Elimu"        value={educationLabel} />
                <InfoRow label="Kazi"         value={member.occupation} />
                <InfoRow label="Hali ya Ndoa" value={maritalLabel} />
                <InfoRow label="Mwenzi"       value={member.spouse_name} />
                <InfoRow label="Watoto"       value={member.dependents_count?.toString()} />
              </dl>
            </CardContent>
          </Card>

          {member.notes && (
            <Card className="border-brand-border bg-brand-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Maelezo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="border-brand-border bg-brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ahadi Zake</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pledges.length === 0 ? (
                <p className="text-xs text-muted-foreground">Hakuna ahadi zilizorekodiwa</p>
              ) : pledges.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{p.pledge_type}</span>
                    <span className="text-brand-gold font-medium">
                      {Math.round(((p.amount_paid ?? 0) / (p.amount_pledged || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-gold to-brand-goldLight rounded-full"
                      style={{ width: `${Math.min(100, Math.round(((p.amount_paid ?? 0) / (p.amount_pledged || 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <Link href={`/dashboard/financials/pledges?member=${member.id}`}>
                  Angalia Ahadi Zote
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-brand-border bg-brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Taarifa</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Ameandikishwa</dt>
                  <dd>{formatDate(member.created_at)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Imesasishwa</dt>
                  <dd>{formatDate(member.updated_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
