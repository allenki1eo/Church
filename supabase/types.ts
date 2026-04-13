export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      church: {
        Row: {
          id:            string
          name:          string
          sub_church_of: string | null
          location:      string | null
          pastor_name:   string | null
          founded_date:  string | null
          logo_url:      string | null
          created_at:    string
        }
        Insert: {
          id?:            string
          name:           string
          sub_church_of?: string | null
          location?:      string | null
          pastor_name?:   string | null
          founded_date?:  string | null
          logo_url?:      string | null
          created_at?:    string
        }
        Update: {
          id?:            string
          name?:          string
          sub_church_of?: string | null
          location?:      string | null
          pastor_name?:   string | null
          founded_date?:  string | null
          logo_url?:      string | null
          created_at?:    string
        }
      }
      profiles: {
        Row: {
          id:         string
          full_name:  string
          role:       'admin' | 'secretary' | 'sub_leader' | 'viewer'
          church_id:  string | null
          phone:      string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id:          string
          full_name:   string
          role:        'admin' | 'secretary' | 'sub_leader' | 'viewer'
          church_id?:  string | null
          phone?:      string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?:         string
          full_name?:  string
          role?:       'admin' | 'secretary' | 'sub_leader' | 'viewer'
          church_id?:  string | null
          phone?:      string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      members: {
        Row: {
          id:                string
          church_id:         string
          full_name:         string
          badge_number:      string | null
          gender:            'me' | 'ke' | null
          date_of_birth:     string | null
          birthplace:        string | null
          tribe:             string | null
          nationality:       string | null
          status:            'active' | 'transferred_in' | 'transferred_out' | 'returned' | 'guest' | 'deceased' | 'inactive'
          joined_date:       string | null
          baptism_date:      string | null
          confirmation_date: string | null
          phone:             string | null
          address:           string | null
          community:         string | null
          occupation:        string | null
          education_level:   'hakuna' | 'msingi' | 'sekondari' | 'chuo' | 'uzamili' | 'uzamivu' | null
          marital_status:    'bachelor' | 'married' | 'widowed' | 'divorced' | null
          spouse_name:       string | null
          dependents_count:  number | null
          photo_url:         string | null
          notes:             string | null
          created_by:        string | null
          created_at:        string
          updated_at:        string
        }
        Insert: {
          id?:                string
          church_id:          string
          full_name:          string
          badge_number?:      string | null
          gender?:            'me' | 'ke' | null
          date_of_birth?:     string | null
          birthplace?:        string | null
          tribe?:             string | null
          nationality?:       string | null
          status?:            'active' | 'transferred_in' | 'transferred_out' | 'returned' | 'guest' | 'deceased' | 'inactive'
          joined_date?:       string | null
          baptism_date?:      string | null
          confirmation_date?: string | null
          phone?:             string | null
          address?:           string | null
          community?:         string | null
          occupation?:        string | null
          education_level?:   'hakuna' | 'msingi' | 'sekondari' | 'chuo' | 'uzamili' | 'uzamivu' | null
          marital_status?:    'bachelor' | 'married' | 'widowed' | 'divorced' | null
          spouse_name?:       string | null
          dependents_count?:  number | null
          photo_url?:         string | null
          notes?:             string | null
          created_by?:        string | null
          created_at?:        string
          updated_at?:        string
        }
        Update: Partial<Database['public']['Tables']['members']['Insert']>
      }
      member_categories: {
        Row: {
          id:            string
          member_id:     string | null
          category:      string
          date_recorded: string | null
          notes:         string | null
        }
        Insert: {
          id?:            string
          member_id?:     string | null
          category:       string
          date_recorded?: string | null
          notes?:         string | null
        }
        Update: Partial<Database['public']['Tables']['member_categories']['Insert']>
      }
      pledges: {
        Row: {
          id:             string
          member_id:      string | null
          church_id:      string
          pledge_type:    'jengo' | 'ahadi' | 'utumishi' | 'ujenzi_miradi' | 'mavuno'
          amount_pledged: number
          amount_paid:    number
          balance:        number
          frequency:      'weekly' | 'monthly' | 'once' | null
          year:           number
          status:         'active' | 'fulfilled' | 'defaulted'
          notes:          string | null
          created_by:     string | null
          created_at:     string
        }
        Insert: {
          id?:             string
          member_id?:      string | null
          church_id:       string
          pledge_type:     'jengo' | 'ahadi' | 'utumishi' | 'ujenzi_miradi' | 'mavuno'
          amount_pledged?: number
          amount_paid?:    number
          frequency?:      'weekly' | 'monthly' | 'once' | null
          year?:           number
          status?:         'active' | 'fulfilled' | 'defaulted'
          notes?:          string | null
          created_by?:     string | null
          created_at?:     string
        }
        Update: Partial<Database['public']['Tables']['pledges']['Insert']>
      }
      pledge_payments: {
        Row: {
          id:               string
          pledge_id:        string | null
          amount:           number
          payment_date:     string
          payment_method:   'cash' | 'mpesa' | 'bank' | 'other' | null
          received_by:      string | null
          reference_number: string | null
          notes:            string | null
          created_at:       string
        }
        Insert: {
          id?:               string
          pledge_id?:        string | null
          amount:            number
          payment_date?:     string
          payment_method?:   'cash' | 'mpesa' | 'bank' | 'other' | null
          received_by?:      string | null
          reference_number?: string | null
          notes?:            string | null
          created_at?:       string
        }
        Update: Partial<Database['public']['Tables']['pledge_payments']['Insert']>
      }
      financials: {
        Row: {
          id:          string
          church_id:   string
          type:        'income' | 'expense'
          category:    string
          amount:      number
          date:        string
          description: string | null
          recorded_by: string | null
          created_at:  string
        }
        Insert: {
          id?:          string
          church_id:    string
          type:         'income' | 'expense'
          category:     string
          amount:       number
          date?:        string
          description?: string | null
          recorded_by?: string | null
          created_at?:  string
        }
        Update: Partial<Database['public']['Tables']['financials']['Insert']>
      }
      services: {
        Row: {
          id:               string
          church_id:        string
          title:            string
          type:             string
          date:             string
          time:             string | null
          preacher:         string | null
          notes:            string | null
          attendance_count: number | null
          created_by:       string | null
          created_at:       string
        }
        Insert: {
          id?:               string
          church_id:         string
          title:             string
          type:              string
          date:              string
          time?:             string | null
          preacher?:         string | null
          notes?:            string | null
          attendance_count?: number | null
          created_by?:       string | null
          created_at?:       string
        }
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      attendance: {
        Row: {
          id:         string
          service_id: string | null
          member_id:  string | null
          present:    boolean | null
        }
        Insert: {
          id?:         string
          service_id?: string | null
          member_id?:  string | null
          present?:    boolean | null
        }
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
    }
    Views: {
      pledge_summary: {
        Row: {
          member_id:      string | null
          full_name:      string | null
          church_id:      string | null
          pledge_id:      string | null
          pledge_type:    string | null
          amount_pledged: number | null
          amount_paid:    number | null
          balance:        number | null
          status:         string | null
          year:           number | null
          frequency:      string | null
        }
      }
      monthly_financials: {
        Row: {
          church_id: string | null
          month:     string | null
          type:      string | null
          category:  string | null
          total:     number | null
        }
      }
    }
    Functions: Record<string, never>
    Enums:     Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Convenience types
export type Church          = Tables<'church'>
export type Profile         = Tables<'profiles'>
export type Member          = Tables<'members'>
export type MemberCategory  = Tables<'member_categories'>
export type Pledge          = Tables<'pledges'>
export type PledgePayment   = Tables<'pledge_payments'>
export type Financial       = Tables<'financials'>
export type Service         = Tables<'services'>
export type Attendance      = Tables<'attendance'>

export type PledgeSummaryRow   = Database['public']['Views']['pledge_summary']['Row']
export type MonthlyFinancialRow = Database['public']['Views']['monthly_financials']['Row']
