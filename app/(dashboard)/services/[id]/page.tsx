import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Users } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SERVICE_TYPES } from '@/lib/constants'
import { formatDate, formatTime, initials } from '@/lib/utils/formatters'
import type { Service } from '@/supabase/types'

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createServerClient() as any

  const [serviceRes, attendanceRes] = await Promise.all([
    sb.from('services').select('*').eq('id', params.id).single(),
    sb.from('attendance').select('*, members(full_name, badge_number)').eq('service_id', params.id),
  ])

  if (serviceRes.error || !serviceRes.data) notFound()

  const service    = serviceRes.data as Service
  const attendance = (attendanceRes.data ?? []) as Array<{
    id: string
    members: { full_name: string; badge_number?: string } | null
  }>
  const typeLabel  = SERVICE_TYPES.find(t => t.value === service.type)?.label ?? service.type

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/dashboard/services"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold">{service.title}</h1>
        <Badge variant="gold" className="ml-auto">{typeLabel}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-brand-border bg-brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Taarifa za Tukio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-brand-gold shrink-0" />
                <span>{formatDate(service.date)}</span>
              </div>
              {service.time && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>{formatTime(service.time)}</span>
                </div>
              )}
              {service.preacher && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>{service.preacher}</span>
                </div>
              )}
              {service.attendance_count != null && (
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Washiriki: <strong>{service.attendance_count}</strong></span>
                </div>
              )}
              {service.notes && (
                <p className="text-sm text-muted-foreground border-t border-brand-border pt-3 mt-3">
                  {service.notes}
                </p>
              )}
            </CardContent>
          </Card>

          {attendance.length > 0 && (
            <Card className="border-brand-border bg-brand-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Orodha ya Waliohudhuria ({attendance.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attendance.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[10px]">
                          {initials(a.members?.full_name ?? '?')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{a.members?.full_name ?? '—'}</span>
                      {a.members?.badge_number && (
                        <span className="text-[10px] text-brand-gold font-mono ml-auto">{a.members.badge_number}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
