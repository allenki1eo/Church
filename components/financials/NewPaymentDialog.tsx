'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { pledgePaymentSchema, type PledgePaymentFormData } from '@/lib/validations/pledge.schema'
import { PAYMENT_METHODS, PLEDGE_TYPES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'

interface NewPaymentDialogProps {
  pledges: Array<Record<string, unknown>>
}

export function NewPaymentDialog({ pledges }: NewPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<PledgePaymentFormData>({
    resolver: zodResolver(pledgePaymentSchema),
    defaultValues: {
      payment_date:   new Date().toISOString().split('T')[0],
      payment_method: 'cash',
    },
  })

  async function onSubmit(data: PledgePaymentFormData) {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('pledge_payments').insert(data)
    if (error) { alert(error.message); return }
    setOpen(false)
    form.reset()
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Rekodi Malipo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rekodi Malipo ya Ahadi</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="pledge_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Ahadi *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Chagua ahadi" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pledges.map((p) => {
                      const member = p.members as { full_name: string } | null
                      const typeLabel = PLEDGE_TYPES.find(t => t.value === p.pledge_type)?.label
                      return (
                        <SelectItem key={p.id as string} value={p.id as string}>
                          {member?.full_name} — {typeLabel} (Baki: {formatCurrency(p.balance as number)})
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kiasi (TZS) *</FormLabel>
                  <FormControl><Input type="number" min={1} placeholder="50000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="payment_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarehe</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="payment_method" render={({ field }) => (
              <FormItem>
                <FormLabel>Njia ya Malipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_METHODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField control={form.control} name="reference_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Nambari ya Rejea (M-Pesa/Benki)</FormLabel>
                <FormControl>
                  <Input placeholder="ABC123XYZ" {...field} value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
              <Button type="submit" variant="gold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hifadhi Malipo'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
