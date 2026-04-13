import { z } from 'zod'

export const financialSchema = z.object({
  church_id:   z.string().uuid(),
  type:        z.enum(['income', 'expense'], { required_error: 'Chagua aina ya muamala' }),
  category:    z.string().min(1, 'Chagua kategoria'),
  amount:      z.coerce.number().positive('Kiasi lazima kiwe zaidi ya sifuri'),
  date:        z.string().default(() => new Date().toISOString().split('T')[0]),
  description: z.string().optional().nullable(),
})

export type FinancialFormData = z.infer<typeof financialSchema>

export const serviceSchema = z.object({
  church_id:        z.string().uuid(),
  title:            z.string().min(2, 'Kichwa lazima kiwe na herufi 2 au zaidi'),
  type:             z.enum(['ibada', 'harusi', 'mazishi', 'ubatizo', 'uthibitisho', 'mkutano', 'semina', 'sherehe', 'mengine'], {
    required_error: 'Chagua aina ya huduma',
  }),
  date:             z.string({ required_error: 'Tarehe inahitajika' }),
  time:             z.string().optional().nullable(),
  preacher:         z.string().optional().nullable(),
  notes:            z.string().optional().nullable(),
  attendance_count: z.coerce.number().int().min(0).optional().nullable(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
