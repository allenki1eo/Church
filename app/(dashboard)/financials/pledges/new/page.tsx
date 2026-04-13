'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { useChurch } from '@/lib/hooks/useChurch'
import { useMembers } from '@/lib/hooks/useMembers'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { pledgeSchema, type PledgeFormData } from '@/lib/validations/pledge.schema'
import { PLEDGE_TYPES, PLEDGE_FREQUENCIES } from '@/lib/constants'

export default function NewPledgePage() {
  const router = useRouter()
  const { profile } = useChurch()
  const { members }  = useMembers({ churchId: profile?.church_id ?? '' })

  const form = useForm<PledgeFormData>({
    resolver: zodResolver(pledgeSchema),
    defaultValues: {
      church_id: profile?.church_id ?? '',
      year:      new Date().getFullYear(),
      frequency: 'monthly',
    },
  })

  async function onSubmit(data: PledgeFormData) {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('pledges').insert({
      ...data,
      created_by: profile?.id,
    })
    if (error) { alert(error.message); return }
    router.push('/dashboard/financials/pledges')
    router.refresh()
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/dashboard/financials/pledges"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <PageHeader title="Ahadi Mpya" description="Andika ahadi ya mwanachama" />
      </div>

      <Card className="border-brand-border bg-brand-card">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="member_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mwanachama *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chagua mwanachama" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="pledge_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Aina ya Ahadi *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chagua aina" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLEDGE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="amount_pledged" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kiasi (TZS) *</FormLabel>
                    <FormControl><Input type="number" min={1} placeholder="500000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="year" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mwaka</FormLabel>
                    <FormControl><Input type="number" min={2000} max={2100} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="frequency" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mara ngapi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chagua mzunguko" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLEDGE_FREQUENCIES.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="gold" disabled={form.formState.isSubmitting} className="flex-1 sm:flex-none">
                  {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hifadhi Ahadi'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
