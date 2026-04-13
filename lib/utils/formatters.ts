import { CURRENCY, LOCALE } from '@/lib/constants'

// ─── Currency ────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sw-TZ', {
    style:                 'currency',
    currency:              CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value)
}

// ─── Dates ───────────────────────────────────
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('sw-TZ', {
    day:   '2-digit',
    month: 'long',
    year:  'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('sw-TZ', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(date))
}

export function formatTime(time: string | null | undefined): string {
  if (!time) return '—'
  const [h, m] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(h), parseInt(m))
  return new Intl.DateTimeFormat('sw-TZ', {
    hour:   '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatMonthYear(date: string | Date): string {
  return new Intl.DateTimeFormat('sw-TZ', {
    month: 'long',
    year:  'numeric',
  }).format(new Date(date))
}

// ─── Percentages ─────────────────────────────
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

export function calcPercent(value: number, total: number): number {
  if (total === 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

// ─── Strings ─────────────────────────────────
export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

export function truncate(text: string, length = 40): string {
  if (text.length <= length) return text
  return `${text.slice(0, length)}...`
}
