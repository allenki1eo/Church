import Link from 'next/link'
import { Phone, MapPin, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { MemberStatusBadge } from './MemberStatusBadge'
import { formatDate, initials } from '@/lib/utils/formatters'
import type { Member } from '@/supabase/types'

interface MemberCardProps { member: Member }

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/dashboard/members/${member.id}`}>
      <Card className="border-brand-border bg-brand-card hover:border-brand-gold/30 hover:shadow-md hover:shadow-brand-gold/5 transition-all duration-200 cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0 ring-2 ring-brand-border group-hover:ring-brand-gold/30 transition-all">
              <AvatarImage src={member.photo_url ?? ''} alt={member.full_name} />
              <AvatarFallback className="font-heading text-sm">
                {initials(member.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground leading-tight">
                    {member.full_name}
                  </h4>
                  {member.badge_number && (
                    <p className="text-[10px] text-brand-gold font-mono mt-0.5">{member.badge_number}</p>
                  )}
                </div>
                <MemberStatusBadge status={member.status} />
              </div>

              <div className="mt-2 space-y-1">
                {member.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.community && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{member.community}</span>
                  </div>
                )}
                {member.joined_date && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Alijiunga: {formatDate(member.joined_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
