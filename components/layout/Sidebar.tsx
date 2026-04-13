'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Wallet, Church, FileText, Settings,
  ChevronDown, LogOut, CreditCard, BookOpen, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { initials } from '@/lib/utils/formatters'
import type { Profile, Church as ChurchType } from '@/supabase/types'
import { useState } from 'react'

const NAV = [
  {
    label: 'Dashibodi',
    href:  '/dashboard',
    icon:  LayoutDashboard,
    exact: true,
  },
  {
    label: 'Wanachama',
    href:  '/dashboard/members',
    icon:  Users,
  },
  {
    label: 'Fedha',
    href:  '/dashboard/financials',
    icon:  Wallet,
    children: [
      { label: 'Ahadi Zake',       href: '/dashboard/financials/pledges' },
      { label: 'Malipo ya Ahadi',  href: '/dashboard/financials/payments' },
      { label: 'Daftari la Fedha', href: '/dashboard/financials/ledger' },
    ],
  },
  {
    label: 'Ibada & Matukio',
    href:  '/dashboard/services',
    icon:  Church,
  },
  {
    label: 'Ripoti',
    href:  '/dashboard/reports',
    icon:  FileText,
  },
  {
    label: 'Mipangilio',
    href:  '/dashboard/settings',
    icon:  Settings,
    children: [
      { label: 'Kanisa',    href: '/dashboard/settings/church' },
      { label: 'Watumiaji', href: '/dashboard/settings/users' },
    ],
  },
]

interface SidebarProps {
  profile: Profile | null
  church:  ChurchType | null
  onClose?: () => void
}

export function Sidebar({ profile, church, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const [expanded, setExpanded] = useState<string[]>(['/dashboard/financials', '/dashboard/settings'])

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  function toggleExpand(href: string) {
    setExpanded(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href],
    )
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-brand-surface border-r border-brand-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold to-brand-goldLight flex items-center justify-center shadow-lg shadow-brand-gold/20 group-hover:shadow-brand-gold/30 transition-shadow">
            <Church className="w-4 h-4 text-brand-dark" />
          </div>
          <div>
            <p className="font-heading font-semibold text-sm text-foreground leading-none">Kanisa360</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[120px]">
              {church?.name ?? 'Kanisa Kuu'}
            </p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <Separator className="bg-brand-border" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active  = isActive(item.href, item.exact)
          const hasKids = item.children && item.children.length > 0
          const open    = expanded.includes(item.href)

          return (
            <div key={item.href}>
              {hasKids ? (
                <button
                  onClick={() => toggleExpand(item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    active
                      ? 'nav-active text-brand-gold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-brand-card/50',
                  )}
                >
                  <item.icon className={cn('w-4 h-4 shrink-0', active && 'text-brand-gold')} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    active
                      ? 'nav-active text-brand-gold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-brand-card/50',
                  )}
                >
                  <item.icon className={cn('w-4 h-4 shrink-0', active && 'text-brand-gold')} />
                  {item.label}
                </Link>
              )}

              {hasKids && open && (
                <div className="ml-10 mt-1 space-y-0.5 border-l border-brand-border pl-3">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={cn(
                        'block px-2 py-2 rounded-md text-xs font-medium transition-colors',
                        isActive(child.href)
                          ? 'text-brand-gold bg-brand-gold/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-brand-card/50',
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <Separator className="bg-brand-border" />

      {/* User profile footer */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-brand-card/50 transition-colors group">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.avatar_url ?? ''} />
            <AvatarFallback className="text-xs">
              {initials(profile?.full_name ?? 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{profile?.full_name ?? 'Mtumiaji'}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{profile?.role ?? '—'}</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Toka"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
