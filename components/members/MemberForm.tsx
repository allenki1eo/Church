'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  MEMBER_STATUSES, GENDER_OPTIONS, MARITAL_STATUSES, EDUCATION_LEVELS,
} from '@/lib/constants'
import { memberSchema, type MemberFormData } from '@/lib/validations/member.schema'
import type { Member } from '@/supabase/types'

interface MemberFormProps {
  defaultValues?: Partial<MemberFormData>
  churchId:       string
  onSubmit:       (data: MemberFormData) => Promise<void>
  isEdit?:        boolean
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-2">
      <h3 className="font-heading text-sm font-semibold text-brand-gold uppercase tracking-widest">{children}</h3>
      <Separator className="bg-brand-border mt-2" />
    </div>
  )
}

export function MemberForm({ defaultValues, churchId, onSubmit, isEdit }: MemberFormProps) {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      church_id:   churchId,
      nationality: 'Tanzanian',
      status:      'active',
      dependents_count: 0,
      ...defaultValues,
    },
  })

  const { formState: { isSubmitting } } = form

  async function handleSubmit(data: MemberFormData) {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* ── Taarifa za Utambulisho ── */}
        <SectionTitle>Taarifa za Utambulisho</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="full_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Jina Kamili *</FormLabel>
              <FormControl><Input placeholder="Maria Yohana Makundi" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="badge_number" render={({ field }) => (
            <FormItem>
              <FormLabel>Nambari ya Kitambulisho</FormLabel>
              <FormControl><Input placeholder="KK-001" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem>
              <FormLabel>Jinsia</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chagua jinsia" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GENDER_OPTIONS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="date_of_birth" render={({ field }) => (
            <FormItem>
              <FormLabel>Tarehe ya Kuzaliwa</FormLabel>
              <FormControl><Input type="date" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="birthplace" render={({ field }) => (
            <FormItem>
              <FormLabel>Mahali pa Kuzaliwa</FormLabel>
              <FormControl><Input placeholder="Moshi, Kilimanjaro" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="tribe" render={({ field }) => (
            <FormItem>
              <FormLabel>Kabila</FormLabel>
              <FormControl><Input placeholder="Chagga" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* ── Uanachama ── */}
        <SectionTitle>Uanachama</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Hali ya Uanachama *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chagua hali" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MEMBER_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="joined_date" render={({ field }) => (
            <FormItem>
              <FormLabel>Tarehe ya Kujiunga</FormLabel>
              <FormControl><Input type="date" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="baptism_date" render={({ field }) => (
            <FormItem>
              <FormLabel>Tarehe ya Ubatizo</FormLabel>
              <FormControl><Input type="date" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="confirmation_date" render={({ field }) => (
            <FormItem>
              <FormLabel>Tarehe ya Uthibitisho</FormLabel>
              <FormControl><Input type="date" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* ── Mawasiliano ── */}
        <SectionTitle>Mawasiliano</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Nambari ya Simu</FormLabel>
              <FormControl><Input placeholder="+255712345678" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="community" render={({ field }) => (
            <FormItem>
              <FormLabel>Jumuiya</FormLabel>
              <FormControl><Input placeholder="Jumuiya ya Upanga" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Makazi</FormLabel>
              <FormControl><Input placeholder="Msasani, Dar es Salaam" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* ── Elimu & Kazi ── */}
        <SectionTitle>Elimu na Kazi</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="education_level" render={({ field }) => (
            <FormItem>
              <FormLabel>Kiwango cha Elimu</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chagua kiwango" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EDUCATION_LEVELS.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="occupation" render={({ field }) => (
            <FormItem>
              <FormLabel>Kazi / Taaluma</FormLabel>
              <FormControl><Input placeholder="Mwalimu, Daktari..." {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* ── Familia ── */}
        <SectionTitle>Hali ya Familia</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="marital_status" render={({ field }) => (
            <FormItem>
              <FormLabel>Hali ya Ndoa</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chagua hali ya ndoa" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MARITAL_STATUSES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="spouse_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Jina la Mwenzi</FormLabel>
              <FormControl><Input placeholder="Jina la mume/mke" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="dependents_count" render={({ field }) => (
            <FormItem>
              <FormLabel>Idadi ya Watoto / Tegemezi</FormLabel>
              <FormControl><Input type="number" min={0} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* ── Maelezo ── */}
        <SectionTitle>Maelezo Mengine</SectionTitle>
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem>
            <FormLabel>Maelezo</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Maelezo mengine muhimu kuhusu mwanachama..."
                className="min-h-[100px]"
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="gold" disabled={isSubmitting} size="lg" className="flex-1 sm:flex-none">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Inahifadhi...</> : isEdit ? 'Hifadhi Mabadiliko' : 'Andikisha Mwanachama'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
