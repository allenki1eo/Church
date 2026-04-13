// ============================================================
// Kanisa360 — Application Constants
// Always import from here — never hardcode strings in components
// ============================================================

export const PLEDGE_TYPES = [
  { value: 'jengo',         label: 'Jengo' },
  { value: 'ahadi',         label: 'Ahadi' },
  { value: 'utumishi',      label: 'Utumishi' },
  { value: 'ujenzi_miradi', label: 'Ujenzi / Miradi' },
  { value: 'mavuno',        label: 'Mavuno' },
] as const

export const MEMBER_STATUSES = [
  { value: 'active',          label: 'Mwanachama' },
  { value: 'transferred_in',  label: 'Aliyehamia Kwetu' },
  { value: 'transferred_out', label: 'Aliyehamia' },
  { value: 'returned',        label: 'Aliyerudi' },
  { value: 'guest',           label: 'Mgeni' },
  { value: 'deceased',        label: 'Aliyefariki' },
  { value: 'inactive',        label: 'Amepumzika' },
] as const

export const MEMBER_CATEGORIES = [
  { value: 'waliofariki',              label: 'Waliofariki' },
  { value: 'waliorudi_kundini',        label: 'Waliorudi Kundini' },
  { value: 'waliofunga_ndoa',          label: 'Waliofunga Ndoa' },
  { value: 'waliobatizwa',             label: 'Waliobatizwa' },
  { value: 'waliobariki_ndoa',         label: 'Waliobarikiwa Ndoa' },
  { value: 'waliohamia',               label: 'Waliohamia' },
  { value: 'waliopokelewa_madhehebu',  label: 'Waliopokelewa (Madhehebu Mengine)' },
  { value: 'wanaoshiriki_sacramenti',  label: 'Wanaoshiriki Sacramenti' },
  { value: 'wageni',                   label: 'Wageni' },
] as const

export const SERVICE_TYPES = [
  { value: 'ibada',       label: 'Ibada' },
  { value: 'harusi',      label: 'Harusi' },
  { value: 'mazishi',     label: 'Mazishi' },
  { value: 'ubatizo',     label: 'Ubatizo' },
  { value: 'uthibitisho', label: 'Uthibitisho' },
  { value: 'mkutano',     label: 'Mkutano' },
  { value: 'semina',      label: 'Semina' },
  { value: 'sherehe',     label: 'Sherehe' },
  { value: 'mengine',     label: 'Mengine' },
] as const

export const FINANCIAL_INCOME_CATEGORIES = [
  { value: 'sadaka',  label: 'Sadaka' },
  { value: 'zaka',    label: 'Zaka' },
  { value: 'mchango', label: 'Mchango' },
  { value: 'jengo',   label: 'Jengo' },
  { value: 'miradi',  label: 'Miradi' },
  { value: 'msaada',  label: 'Msaada' },
] as const

export const FINANCIAL_EXPENSE_CATEGORIES = [
  { value: 'matumizi_ya_kanisa', label: 'Matumizi ya Kanisa' },
  { value: 'mishahara',          label: 'Mishahara' },
  { value: 'matengenezo',        label: 'Matengenezo' },
  { value: 'huduma',             label: 'Huduma' },
  { value: 'mengine',            label: 'Mengine' },
] as const

export const ALL_FINANCIAL_CATEGORIES = [
  ...FINANCIAL_INCOME_CATEGORIES,
  ...FINANCIAL_EXPENSE_CATEGORIES,
] as const

export const ROLES = [
  { value: 'admin',      label: 'Msimamizi Mkuu' },
  { value: 'secretary',  label: 'Katibu' },
  { value: 'sub_leader', label: 'Kiongozi wa Kanisa Dogo' },
  { value: 'viewer',     label: 'Mtazamaji' },
] as const

export const GENDER_OPTIONS = [
  { value: 'me', label: 'Mme' },
  { value: 'ke', label: 'Mke' },
] as const

export const MARITAL_STATUSES = [
  { value: 'bachelor', label: 'Mseja' },
  { value: 'married',  label: 'Mwenye Ndoa' },
  { value: 'widowed',  label: 'Mjane' },
  { value: 'divorced', label: 'Talaka' },
] as const

export const EDUCATION_LEVELS = [
  { value: 'hakuna',    label: 'Hakuna' },
  { value: 'msingi',    label: 'Msingi' },
  { value: 'sekondari', label: 'Sekondari' },
  { value: 'chuo',      label: 'Chuo' },
  { value: 'uzamili',   label: 'Uzamili' },
  { value: 'uzamivu',   label: 'Uzamivu' },
] as const

export const PAYMENT_METHODS = [
  { value: 'cash',  label: 'Taslimu' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'bank',  label: 'Benki' },
  { value: 'other', label: 'Nyingine' },
] as const

export const PLEDGE_FREQUENCIES = [
  { value: 'weekly',  label: 'Kila Wiki' },
  { value: 'monthly', label: 'Kila Mwezi' },
  { value: 'once',    label: 'Mara Moja' },
] as const

export const PLEDGE_STATUSES = [
  { value: 'active',    label: 'Inaendelea' },
  { value: 'fulfilled', label: 'Imekamilika' },
  { value: 'defaulted', label: 'Imeshindwa' },
] as const

export const CURRENCY = 'TZS'
export const LOCALE   = 'sw-TZ'

export const NAV_ITEMS = [
  {
    label: 'Dashibodi',
    href:  '/dashboard',
    icon:  'LayoutDashboard',
  },
  {
    label: 'Wanachama',
    href:  '/dashboard/members',
    icon:  'Users',
  },
  {
    label: 'Fedha',
    href:  '/dashboard/financials/ledger',
    icon:  'Wallet',
    children: [
      { label: 'Ahadi Zake', href: '/dashboard/financials/pledges' },
      { label: 'Malipo ya Ahadi', href: '/dashboard/financials/payments' },
      { label: 'Daftari la Fedha', href: '/dashboard/financials/ledger' },
    ],
  },
  {
    label: 'Ibada & Matukio',
    href:  '/dashboard/services',
    icon:  'Church',
  },
  {
    label: 'Ripoti',
    href:  '/dashboard/reports',
    icon:  'FileText',
  },
  {
    label: 'Mipangilio',
    href:  '/dashboard/settings/church',
    icon:  'Settings',
    children: [
      { label: 'Kanisa', href: '/dashboard/settings/church' },
      { label: 'Watumiaji', href: '/dashboard/settings/users' },
    ],
  },
] as const
