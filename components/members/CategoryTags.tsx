import { Badge } from '@/components/ui/badge'
import { MEMBER_CATEGORIES } from '@/lib/constants'
import type { MemberCategory } from '@/supabase/types'

interface CategoryTagsProps {
  categories: Pick<MemberCategory, 'category'>[]
}

export function CategoryTags({ categories }: CategoryTagsProps) {
  if (!categories.length) return <span className="text-xs text-muted-foreground">—</span>

  return (
    <div className="flex flex-wrap gap-1">
      {categories.map((cat, i) => {
        const label = MEMBER_CATEGORIES.find(c => c.value === cat.category)?.label ?? cat.category
        return (
          <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 border-brand-border text-muted-foreground">
            {label}
          </Badge>
        )
      })}
    </div>
  )
}
