'use client'

import Link from 'next/link'
import { Eye, Edit } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MemberStatusBadge } from './MemberStatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, initials } from '@/lib/utils/formatters'
import type { Member } from '@/supabase/types'

interface MemberTableProps {
  members: Member[]
  loading?: boolean
}

export function MemberTable({ members, loading }: MemberTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-brand-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-brand-border bg-brand-surface/50">
              <TableHead>Mwanachama</TableHead>
              <TableHead>Hali</TableHead>
              <TableHead className="hidden md:table-cell">Jumuiya</TableHead>
              <TableHead className="hidden lg:table-cell">Tarehe ya Kujiunga</TableHead>
              <TableHead className="hidden lg:table-cell">Simu</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i} className="border-brand-border/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-3 w-24" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-3 w-24" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-3 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-brand-border bg-brand-card flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-surface flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="font-heading text-sm font-medium text-foreground">Hakuna wanachama walioopatikana</p>
        <p className="text-xs text-muted-foreground mt-1">Badilisha vichujio au ongeza mwanachama mpya</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-brand-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-brand-border bg-brand-surface/50 hover:bg-brand-surface/50">
            <TableHead className="text-xs uppercase tracking-wider">Mwanachama</TableHead>
            <TableHead className="text-xs uppercase tracking-wider">Hali</TableHead>
            <TableHead className="hidden md:table-cell text-xs uppercase tracking-wider">Jumuiya</TableHead>
            <TableHead className="hidden lg:table-cell text-xs uppercase tracking-wider">Alijiunga</TableHead>
            <TableHead className="hidden lg:table-cell text-xs uppercase tracking-wider">Simu</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-brand-border/40 group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={member.photo_url ?? ''} />
                    <AvatarFallback className="text-xs">{initials(member.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-none">{member.full_name}</p>
                    {member.badge_number && (
                      <p className="text-[10px] text-brand-gold font-mono mt-0.5">{member.badge_number}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <MemberStatusBadge status={member.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {member.community ?? '—'}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {formatDate(member.joined_date)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground font-mono">
                {member.phone ?? '—'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                    <Link href={`/dashboard/members/${member.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                    <Link href={`/dashboard/members/${member.id}/edit`}>
                      <Edit className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
