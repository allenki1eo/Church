import { z } from 'zod'

export const memberSchema = z.object({
  church_id:         z.string().uuid(),
  full_name:         z.string().min(2, 'Jina lazima liwe na herufi 2 au zaidi'),
  badge_number:      z.string().optional().nullable(),
  gender:            z.enum(['me', 'ke']).optional().nullable(),
  date_of_birth:     z.string().optional().nullable(),
  birthplace:        z.string().optional().nullable(),
  tribe:             z.string().optional().nullable(),
  nationality:       z.string().default('Tanzanian'),
  status:            z.enum(['active', 'transferred_in', 'transferred_out', 'returned', 'guest', 'deceased', 'inactive']).default('active'),
  joined_date:       z.string().optional().nullable(),
  baptism_date:      z.string().optional().nullable(),
  confirmation_date: z.string().optional().nullable(),
  phone:             z.string().optional().nullable(),
  address:           z.string().optional().nullable(),
  community:         z.string().optional().nullable(),
  occupation:        z.string().optional().nullable(),
  education_level:   z.enum(['hakuna', 'msingi', 'sekondari', 'chuo', 'uzamili', 'uzamivu']).optional().nullable(),
  marital_status:    z.enum(['bachelor', 'married', 'widowed', 'divorced']).optional().nullable(),
  spouse_name:       z.string().optional().nullable(),
  dependents_count:  z.coerce.number().int().min(0).default(0),
  photo_url:         z.string().url().optional().nullable(),
  notes:             z.string().optional().nullable(),
})

export type MemberFormData = z.infer<typeof memberSchema>

export const memberSearchSchema = z.object({
  query:  z.string().optional(),
  status: z.string().optional(),
  gender: z.string().optional(),
  page:   z.coerce.number().int().positive().default(1),
})

export type MemberSearchParams = z.infer<typeof memberSearchSchema>
