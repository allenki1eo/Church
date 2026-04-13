import Link from 'next/link'
import { Plus, Calendar, Users, Clock } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SERVICE_TYPES } from '@/lib/constants'
import { formatDate, formatTime } from '@/lib/utils/formatters'
import { NewServiceDialog } from '@/components/services/NewServiceDialog'
import type { Service } from '@/supabase/types'

export const metadata = { title: 'Ibada na Matukio' }

export default async function ServicesPage() {
  const profile  = await getProfile()
  const churchId = profile?.church_id
  let services: Service[] = []

  if (churchId) {
    try {
      const supabase = createServerClient()
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('church_id', churchId)
        .order('date', { ascending: false })
      services = data ?? []
    } catch { /* */ }
  }

  const upcoming = services.filter(s => new Date(s.date) >= new Date())
  const past     = services.filter(s => new Date(s.date) <  new Date())

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ibada na Matukio"
        description="Rekodi za ibada, harusi, mazishi na matukio mengine"
        action={
          churchId ? <NewServiceDialog churchId={churchId} /> : null
        }
      />

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-base font-semibold text-brand-gold">Yanayokuja</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcoming.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-heading text-base font-semibold text-muted-foreground">Yaliyopita</h2>
        {past.length === 0 ? (
          <div className="rounded-xl border border-brand-border bg-brand-card flex items-center justify-center py-14">
            <p className="text-muted-foreground text-sm">Hakuna matukio yaliyopita</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {past.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </section>
    </div>
  )
}

function ServiceCard({ service }: { service: Service }) {
  const typeLabel = SERVICE_TYPES.find(t => t.value === service.type)?.label ?? service.type
  const isPast    = new Date(service.date) < new Date()

  return (
    <Link href={`/dashboard/services/${service.id}`}>
      <Card className={`border-brand-border bg-brand-card hover:border-brand-gold/30 hover:shadow-md transition-all duration-200 cursor-pointer ${isPast ? 'opacity-70' : ''}`}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading font-semibold text-sm text-foreground leading-tight">{service.title}</h3>
              {service.preacher && (
                <p className="text-xs text-muted-foreground mt-0.5">{service.preacher}</p>
              )}
            </div>
            <Badge variant="gold" className="shrink-0 text-[10px]">{typeLabel}</Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatDate(service.date)}
            </div>
            {service.time && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {formatTime(service.time)}
              </div>
            )}
          </div>

          {service.attendance_count != null && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>Washiriki: {service.attendance_count}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
