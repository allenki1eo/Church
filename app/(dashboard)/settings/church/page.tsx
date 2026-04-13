'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Building2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { useChurch } from '@/lib/hooks/useChurch'
import type { Church } from '@/supabase/types'

const churchSchema = z.object({
  name:         z.string().min(2),
  location:     z.string().optional().nullable(),
  pastor_name:  z.string().optional().nullable(),
  founded_date: z.string().optional().nullable(),
})
type ChurchFormData = z.infer<typeof churchSchema>

export default function ChurchSettingsPage() {
  const { church, profile, loading } = useChurch()
  const [saved, setSaved] = useState(false)

  const form = useForm<ChurchFormData>({
    resolver: zodResolver(churchSchema),
  })

  useEffect(() => {
    if (church) {
      form.reset({
        name:         church.name,
        location:     church.location,
        pastor_name:  church.pastor_name,
        founded_date: church.founded_date,
      })
    }
  }, [church, form])

  async function onSubmit(data: ChurchFormData) {
    if (!church?.id) return
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('church').update(data).eq('id', church.id)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-xl border border-brand-border bg-brand-card p-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const canEdit = profile?.role === 'admin'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Mipangilio ya Kanisa"
        description="Taarifa za kimsingi za kanisa lako"
      />

      <Card className="border-brand-border bg-brand-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-gold" />
            Kanisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Jina la Kanisa *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!canEdit} placeholder="Kanisa Kuu la Heri" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mahali</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={!canEdit} placeholder="Dar es Salaam, Tanzania" />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="pastor_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Jina la Mchungaji</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={!canEdit} placeholder="Mch. Yohana Makundi" />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="founded_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarehe ya Kuanzishwa</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ''} disabled={!canEdit} />
                  </FormControl>
                </FormItem>
              )} />

              {canEdit && (
                <Button type="submit" variant="gold" disabled={form.formState.isSubmitting} className="mt-2">
                  {form.formState.isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Inahifadhi...</>
                  ) : saved ? (
                    'Imehifadhiwa!'
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> Hifadhi</>
                  )}
                </Button>
              )}

              {!canEdit && (
                <p className="text-xs text-muted-foreground">
                  Ni Msimamizi Mkuu peke yake anayeweza kubadilisha taarifa hizi.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
