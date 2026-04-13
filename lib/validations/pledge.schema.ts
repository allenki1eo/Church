import { z } from 'zod'

export const pledgeSchema = z.object({
  member_id:      z.string().uuid('Tafadhali chagua mwanachama'),
  church_id:      z.string().uuid(),
  pledge_type:    z.enum(['jengo', 'ahadi', 'utumishi', 'ujenzi_miradi', 'mavuno'], {
    required_error: 'Chagua aina ya ahadi',
  }),
  amount_pledged: z.coerce.number().positive('Kiasi lazima kiwe zaidi ya sifuri'),
  frequency:      z.enum(['weekly', 'monthly', 'once']).optional().nullable(),
  year:           z.coerce.number().int().min(2000).max(2100).default(new Date().getFullYear()),
  notes:          z.string().optional().nullable(),
})

export type PledgeFormData = z.infer<typeof pledgeSchema>

export const pledgePaymentSchema = z.object({
  pledge_id:        z.string().uuid(),
  amount:           z.coerce.number().positive('Kiasi lazima kiwe zaidi ya sifuri'),
  payment_date:     z.string().default(() => new Date().toISOString().split('T')[0]),
  payment_method:   z.enum(['cash', 'mpesa', 'bank', 'other']).default('cash'),
  reference_number: z.string().optional().nullable(),
  notes:            z.string().optional().nullable(),
})

export type PledgePaymentFormData = z.infer<typeof pledgePaymentSchema>
