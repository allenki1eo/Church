import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import type { Profile, Church } from '@/supabase/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profileWithChurch = await getProfile()

  if (!profileWithChurch) {
    redirect('/login')
  }

  const { church, ...profile } = profileWithChurch

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar
          profile={profile as Profile}
          church={church as Church | null}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          profile={profile as Profile}
          church={church as Church | null}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-page">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
