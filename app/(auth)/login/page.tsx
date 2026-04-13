'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Church, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  email:    z.string().email('Barua pepe si sahihi'),
  password: z.string().min(6, 'Nywila lazima iwe na herufi 6 au zaidi'),
})
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router   = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    })
    if (authError) {
      setError('Barua pepe au nywila si sahihi. Jaribu tena.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-goldLight flex items-center justify-center shadow-xl shadow-brand-gold/20 mb-4">
            <Church className="w-8 h-8 text-brand-dark" />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Kanisa360</h1>
          <p className="text-muted-foreground text-sm mt-1">Mfumo wa Usimamizi wa Kanisa</p>
        </div>

        <Card className="border-brand-border/60 bg-brand-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-heading">Ingia kwenye Akaunti</CardTitle>
            <CardDescription>Weka barua pepe na nywila yako kuingia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Barua Pepe</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="msimamizi@kanisa.tz"
                  autoComplete="email"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Nywila</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="gold"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Ingia...</>
                ) : (
                  'Ingia'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Una tatizo la kuingia? Wasiliana na Msimamizi Mkuu.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          © {new Date().getFullYear()} Kanisa360. Haki zote zimehifadhiwa.
        </p>
      </div>
    </div>
  )
}
