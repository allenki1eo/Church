import { Users, Shield } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ROLES } from '@/lib/constants'
import { formatDate, initials } from '@/lib/utils/formatters'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Watumiaji' }

export default async function UsersPage() {
  const profile = await getProfile()

  if (!profile || !['admin', 'secretary'].includes(profile.role)) {
    redirect('/dashboard')
  }

  let profiles: Array<Record<string, unknown>> = []

  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('church_id', profile.church_id ?? '')
      .order('created_at', { ascending: true })

    profiles = (data ?? []) as Array<Record<string, unknown>>
  } catch { /* */ }

  const roleVariant: Record<string, 'gold' | 'info' | 'warning' | 'secondary'> = {
    admin:      'gold',
    secretary:  'info',
    sub_leader: 'warning',
    viewer:     'secondary',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Watumiaji"
        description="Watumiaji wote waliounganishwa na kanisa hili"
      />

      <Card className="border-brand-border bg-brand-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-gold" />
            Watumiaji ({profiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-brand-border bg-brand-surface/50 hover:bg-brand-surface/50">
                <TableHead className="text-xs uppercase tracking-wider">Mtumiaji</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Jukumu</TableHead>
                <TableHead className="text-xs uppercase tracking-wider hidden sm:table-cell">Simu</TableHead>
                <TableHead className="text-xs uppercase tracking-wider hidden md:table-cell">Amejiandikisha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((u) => {
                const roleLabel = ROLES.find(r => r.value === u.role)?.label ?? (u.role as string)
                return (
                  <TableRow key={u.id as string} className="border-brand-border/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-xs">
                            {initials(u.full_name as string)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{u.full_name as string}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[u.role as string] ?? 'secondary'}>
                        {roleLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground font-mono">
                      {(u.phone as string) ?? '—'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {formatDate(u.created_at as string)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-brand-border/50 bg-brand-surface/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Msimamizi Mkuu</strong> — Mamlaka kamili ya kufanya mabadiliko yote</p>
              <p><strong className="text-foreground">Katibu</strong> — Anaweza kuingiza data na kuona ripoti</p>
              <p><strong className="text-foreground">Kiongozi wa Kanisa Dogo</strong> — Anaona data ya kanisa lake peke yake</p>
              <p><strong className="text-foreground">Mtazamaji</strong> — Anaona ripoti tu, hawezi kubadilisha chochote</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
