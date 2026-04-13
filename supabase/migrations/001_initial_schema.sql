-- ============================================================
-- Kanisa360 — Initial Schema Migration
-- Run this in: Supabase SQL Editor or `supabase db push`
-- ============================================================

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- CHURCH PROFILE
-- ─────────────────────────────────────────────
create table if not exists church (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  sub_church_of uuid references church(id),   -- null = this is the lead church
  location      text,
  pastor_name   text,
  founded_date  date,
  logo_url      text,
  created_at    timestamptz default now()
);

comment on table church is 'Lead church and sub-churches registry';

-- ─────────────────────────────────────────────
-- USER PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  role       text not null check (role in ('admin', 'secretary', 'sub_leader', 'viewer')),
  church_id  uuid references church(id),
  phone      text,
  avatar_url text,
  created_at timestamptz default now()
);

comment on table profiles is 'Extended user profiles with church role';

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'viewer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- MEMBERS (Taarifa Binafsi)
-- ─────────────────────────────────────────────
create table if not exists members (
  id          uuid primary key default gen_random_uuid(),
  church_id   uuid references church(id) not null,

  -- Identity
  full_name      text not null,
  badge_number   text unique,
  gender         text check (gender in ('me', 'ke')),
  date_of_birth  date,
  birthplace     text,
  tribe          text,
  nationality    text default 'Tanzanian',

  -- Membership
  status            text not null default 'active' check (status in (
    'active', 'transferred_in', 'transferred_out',
    'returned', 'guest', 'deceased', 'inactive'
  )),
  joined_date       date,
  baptism_date      date,
  confirmation_date date,

  -- Contact
  phone     text,
  address   text,
  community text,

  -- Background
  occupation      text,
  education_level text check (education_level in (
    'hakuna', 'msingi', 'sekondari', 'chuo', 'uzamili', 'uzamivu'
  )),

  -- Family
  marital_status   text check (marital_status in (
    'bachelor', 'married', 'widowed', 'divorced'
  )),
  spouse_name      text,
  dependents_count integer default 0,

  -- Media
  photo_url text,

  -- Meta
  notes      text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table members is 'Congregation member records (Taarifa Binafsi)';

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger members_updated_at
  before update on members
  for each row execute procedure update_updated_at_column();

-- ─────────────────────────────────────────────
-- MEMBER CATEGORIES
-- ─────────────────────────────────────────────
create table if not exists member_categories (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid references members(id) on delete cascade,
  category      text not null check (category in (
    'waliofariki',
    'waliorudi_kundini',
    'waliofunga_ndoa',
    'waliobatizwa',
    'waliobariki_ndoa',
    'waliohamia',
    'waliopokelewa_madhehebu',
    'wanaoshiriki_sacramenti',
    'wageni'
  )),
  date_recorded date default current_date,
  notes         text
);

comment on table member_categories is 'Categorical tags that can apply to a member';

-- ─────────────────────────────────────────────
-- PLEDGES (Ahadi Zake)
-- ─────────────────────────────────────────────
create table if not exists pledges (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid references members(id) on delete cascade,
  church_id   uuid references church(id) not null,

  pledge_type text not null check (pledge_type in (
    'jengo', 'ahadi', 'utumishi', 'ujenzi_miradi', 'mavuno'
  )),

  amount_pledged numeric(12,2) not null default 0,
  amount_paid    numeric(12,2) not null default 0,
  balance        numeric(12,2) generated always as (amount_pledged - amount_paid) stored,

  frequency text check (frequency in ('weekly', 'monthly', 'once')),
  year      integer not null default extract(year from now())::integer,
  status    text not null default 'active' check (status in ('active', 'fulfilled', 'defaulted')),

  notes      text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

comment on table pledges is 'Member pledge commitments (Ahadi Zake)';

-- ─────────────────────────────────────────────
-- PLEDGE PAYMENTS
-- ─────────────────────────────────────────────
create table if not exists pledge_payments (
  id               uuid primary key default gen_random_uuid(),
  pledge_id        uuid references pledges(id) on delete cascade,
  amount           numeric(12,2) not null,
  payment_date     date not null default current_date,
  payment_method   text check (payment_method in ('cash', 'mpesa', 'bank', 'other')),
  received_by      uuid references profiles(id),
  reference_number text,
  notes            text,
  created_at       timestamptz default now()
);

comment on table pledge_payments is 'Individual payment records for pledges';

-- After a payment, update amount_paid on the pledge
create or replace function update_pledge_amount_paid()
returns trigger language plpgsql as $$
begin
  update pledges
  set amount_paid = (
    select coalesce(sum(amount), 0)
    from pledge_payments
    where pledge_id = new.pledge_id
  )
  where id = new.pledge_id;

  -- Auto-fulfil if fully paid
  update pledges
  set status = 'fulfilled'
  where id = new.pledge_id
    and amount_paid >= amount_pledged
    and status = 'active';

  return new;
end;
$$;

create trigger after_payment_insert
  after insert on pledge_payments
  for each row execute procedure update_pledge_amount_paid();

-- ─────────────────────────────────────────────
-- GENERAL FINANCIALS (Ledger)
-- ─────────────────────────────────────────────
create table if not exists financials (
  id          uuid primary key default gen_random_uuid(),
  church_id   uuid references church(id) not null,
  type        text not null check (type in ('income', 'expense')),
  category    text not null check (category in (
    'sadaka', 'zaka', 'mchango', 'jengo', 'miradi', 'msaada',
    'matumizi_ya_kanisa', 'mishahara', 'matengenezo', 'huduma', 'mengine'
  )),
  amount      numeric(12,2) not null,
  date        date not null default current_date,
  description text,
  recorded_by uuid references profiles(id),
  created_at  timestamptz default now()
);

comment on table financials is 'General income and expense ledger';

-- ─────────────────────────────────────────────
-- SERVICES & EVENTS
-- ─────────────────────────────────────────────
create table if not exists services (
  id               uuid primary key default gen_random_uuid(),
  church_id        uuid references church(id) not null,
  title            text not null,
  type             text not null check (type in (
    'ibada', 'harusi', 'mazishi', 'ubatizo', 'uthibitisho',
    'mkutano', 'semina', 'sherehe', 'mengine'
  )),
  date             date not null,
  time             time,
  preacher         text,
  notes            text,
  attendance_count integer,
  created_by       uuid references profiles(id),
  created_at       timestamptz default now()
);

comment on table services is 'Church services and events';

-- ─────────────────────────────────────────────
-- ATTENDANCE
-- ─────────────────────────────────────────────
create table if not exists attendance (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete cascade,
  member_id  uuid references members(id) on delete cascade,
  present    boolean default true,
  unique (service_id, member_id)
);

comment on table attendance is 'Service attendance records';

-- ─────────────────────────────────────────────
-- VIEWS
-- ─────────────────────────────────────────────

create or replace view pledge_summary as
select
  m.id        as member_id,
  m.full_name,
  m.church_id,
  p.id        as pledge_id,
  p.pledge_type,
  p.amount_pledged,
  p.amount_paid,
  p.balance,
  p.status,
  p.year,
  p.frequency
from members m
join pledges p on p.member_id = m.id;

create or replace view monthly_financials as
select
  church_id,
  date_trunc('month', date) as month,
  type,
  category,
  sum(amount) as total
from financials
group by church_id, month, type, category;

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table church           enable row level security;
alter table profiles         enable row level security;
alter table members          enable row level security;
alter table member_categories enable row level security;
alter table pledges          enable row level security;
alter table pledge_payments  enable row level security;
alter table financials       enable row level security;
alter table services         enable row level security;
alter table attendance       enable row level security;

-- Profiles: users can read their own profile
create policy "profiles_own_read" on profiles
  for select using (id = auth.uid());

create policy "profiles_own_update" on profiles
  for update using (id = auth.uid());

-- Admins can read all profiles in their church
create policy "profiles_admin_read" on profiles
  for select using (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
  );

-- Church: any authenticated user can read
create policy "church_authenticated_read" on church
  for select using (auth.uid() is not null);

-- Church: only admins can write
create policy "church_admin_write" on church
  for all using (
    (select role from profiles where id = auth.uid()) = 'admin'
  );

-- Members: church isolation
create policy "members_church_isolation" on members
  for select using (
    church_id in (select church_id from profiles where id = auth.uid())
  );

create policy "members_write_access" on members
  for insert with check (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
    and church_id in (select church_id from profiles where id = auth.uid())
  );

create policy "members_update_access" on members
  for update using (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
    and church_id in (select church_id from profiles where id = auth.uid())
  );

-- Member categories: follows member access
create policy "member_categories_read" on member_categories
  for select using (
    member_id in (
      select id from members
      where church_id in (select church_id from profiles where id = auth.uid())
    )
  );

create policy "member_categories_write" on member_categories
  for insert with check (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
  );

-- Pledges: church isolation
create policy "pledges_church_isolation" on pledges
  for select using (
    church_id in (select church_id from profiles where id = auth.uid())
  );

create policy "pledges_write_access" on pledges
  for all using (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
    and church_id in (select church_id from profiles where id = auth.uid())
  );

-- Pledge payments: follows pledge access
create policy "pledge_payments_read" on pledge_payments
  for select using (
    pledge_id in (
      select id from pledges
      where church_id in (select church_id from profiles where id = auth.uid())
    )
  );

create policy "pledge_payments_write" on pledge_payments
  for insert with check (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
  );

-- Financials: church isolation
create policy "financials_church_isolation" on financials
  for select using (
    church_id in (select church_id from profiles where id = auth.uid())
  );

create policy "financials_write_access" on financials
  for all using (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
    and church_id in (select church_id from profiles where id = auth.uid())
  );

-- Services: church isolation
create policy "services_church_isolation" on services
  for select using (
    church_id in (select church_id from profiles where id = auth.uid())
  );

create policy "services_write_access" on services
  for all using (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
    and church_id in (select church_id from profiles where id = auth.uid())
  );

-- Attendance: follows service access
create policy "attendance_read" on attendance
  for select using (
    service_id in (
      select id from services
      where church_id in (select church_id from profiles where id = auth.uid())
    )
  );

create policy "attendance_write" on attendance
  for all using (
    (select role from profiles where id = auth.uid()) in ('admin', 'secretary')
  );

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index if not exists members_church_id_idx      on members(church_id);
create index if not exists members_status_idx         on members(status);
create index if not exists members_full_name_idx      on members using gin(to_tsvector('english', full_name));
create index if not exists pledges_church_id_idx      on pledges(church_id);
create index if not exists pledges_member_id_idx      on pledges(member_id);
create index if not exists pledges_year_idx           on pledges(year);
create index if not exists financials_church_id_idx   on financials(church_id);
create index if not exists financials_date_idx        on financials(date);
create index if not exists services_church_id_idx     on services(church_id);
create index if not exists services_date_idx          on services(date);
create index if not exists attendance_service_id_idx  on attendance(service_id);
