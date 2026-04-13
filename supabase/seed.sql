-- ============================================================
-- Kanisa360 — Development Seed Data
-- Run AFTER migrations. Only for local/dev environments.
-- ============================================================

-- Seed a lead church
insert into church (id, name, location, pastor_name, founded_date)
values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Kanisa Kuu la Heri',
  'Dar es Salaam, Tanzania',
  'Mch. Yohana Makundi',
  '1985-03-15'
) on conflict do nothing;

-- Seed sub-churches
insert into church (id, name, sub_church_of, location, pastor_name)
values
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Kanisa la Upanga', 'aaaaaaaa-0000-0000-0000-000000000001', 'Upanga, Dar es Salaam', 'Mch. Petro Kimaro'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Kanisa la Kariakoo', 'aaaaaaaa-0000-0000-0000-000000000001', 'Kariakoo, Dar es Salaam', 'Mch. Anna Mwanga')
on conflict do nothing;

-- Note: Profiles are created automatically via the auth trigger.
-- To seed members, first create users via Supabase Auth dashboard,
-- then update their church_id and role via:
--   update profiles set church_id = 'aaaaaaaa-0000-0000-0000-000000000001', role = 'admin'
--   where id = '<your-user-uuid>';

-- Seed sample members (without created_by to avoid FK issues in dev)
insert into members (
  church_id, full_name, badge_number, gender, date_of_birth,
  status, joined_date, baptism_date, phone, address, community,
  occupation, marital_status, nationality
)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Maria Yohana Makundi',  'KK-001', 'ke', '1970-06-12', 'active', '1990-01-01', '1975-12-25', '+255712345001', 'Msasani, DSM',    'Jumuiya ya Upanga',   'Mwalimu',    'married', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Petro John Msigwa',     'KK-002', 'me', '1965-03-20', 'active', '1988-06-15', '1972-04-10', '+255712345002', 'Kinondoni, DSM',  'Jumuiya ya Msimbazi', 'Mhandisi',   'married', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Anna Grace Mwanga',     'KK-003', 'ke', '1985-11-08', 'active', '2005-03-20', '1992-08-15', '+255712345003', 'Ilala, DSM',      'Jumuiya ya Kariakoo', 'Muuguzi',    'married', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Emmanuel Luvanda',      'KK-004', 'me', '1992-07-30', 'active', '2010-09-01', '2000-12-25', '+255712345004', 'Temeke, DSM',     'Jumuiya ya Temeke',   'Daktari',    'bachelor', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Rebeka Samuel Kileo',   'KK-005', 'ke', '1978-02-14', 'active', '2000-01-01', '1985-06-29', '+255712345005', 'Mbagala, DSM',    'Jumuiya ya Mbagala',  'Mfanyabiashara', 'widowed', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Daniel Mahenge',        'KK-006', 'me', '1955-09-22', 'active', '1975-07-01', '1962-12-25', '+255712345006', 'Magomeni, DSM',   'Jumuiya ya Magomeni', 'Mstaafu',    'married', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Selina James Ngowi',    'KK-007', 'ke', '2001-04-18', 'active', '2018-03-15', '2010-04-04', '+255712345007', 'Sinza, DSM',      'Jumuiya ya Sinza',    'Mwanafunzi', 'bachelor', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Thomas Baraka Minja',   'KK-008', 'me', '1988-12-05', 'transferred_in', '2020-06-01', '1995-11-30', '+255712345008', 'Ubungo, DSM', 'Jumuiya ya Ubungo', 'Mhandisi wa Kompyuta', 'married', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Grace Philip Nkembo',   'KK-009', 'ke', '1960-08-11', 'active', '1982-01-01', '1968-04-06', '+255712345009', 'Buguruni, DSM',   'Jumuiya ya Buguruni', 'Mama Nyumbani', 'married', 'Tanzanian'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Joshua Clement Mwita',  'KK-010', 'me', '1975-05-25', 'active', '1995-08-20', '1982-12-25', '+255712345010', 'Kigamboni, DSM',  'Jumuiya ya Kigamboni', 'Mwalimu', 'married', 'Tanzanian')
on conflict do nothing;

-- Sample pledges for first few members
insert into pledges (member_id, church_id, pledge_type, amount_pledged, amount_paid, frequency, year, status)
select
  m.id,
  m.church_id,
  unnest(array['jengo','ahadi','mavuno']) as pledge_type,
  unnest(array[500000, 200000, 100000]) as amount_pledged,
  unnest(array[250000, 150000, 75000]) as amount_paid,
  'monthly',
  2024,
  'active'
from members m
where m.badge_number in ('KK-001', 'KK-002', 'KK-003')
on conflict do nothing;

-- Sample services
insert into services (church_id, title, type, date, time, preacher, attendance_count)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Ibada ya Jumapili', 'ibada', current_date - 7,  '09:00', 'Mch. Yohana Makundi', 142),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Ibada ya Jumapili', 'ibada', current_date - 14, '09:00', 'Mch. Yohana Makundi', 138),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Ibada ya Jumapili', 'ibada', current_date - 21, '09:00', 'Mch. Petro Kimaro',   155),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Harusi ya Msigwa', 'harusi', current_date - 30, '14:00', 'Mch. Yohana Makundi', 200),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Mkutano wa Kanisa', 'mkutano', current_date - 5, '18:00', null, 85)
on conflict do nothing;

-- Sample financials
insert into financials (church_id, type, category, amount, date, description)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'income',  'sadaka',   850000,  current_date - 7,  'Sadaka ya Jumapili'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'income',  'zaka',     320000,  current_date - 7,  'Zaka ya Jumapili'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'income',  'jengo',    1200000, current_date - 7,  'Mchango wa Jengo'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'income',  'sadaka',   920000,  current_date - 14, 'Sadaka ya Jumapili'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'income',  'zaka',     280000,  current_date - 14, 'Zaka ya Jumapili'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'expense', 'huduma',   450000,  current_date - 10, 'Bili ya Umeme na Maji'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'expense', 'mishahara', 800000, current_date - 1,  'Mishahara ya Wafanyakazi'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'income',  'sadaka',   780000,  current_date - 21, 'Sadaka ya Jumapili'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'expense', 'matengenezo', 300000, current_date - 3, 'Matengenezo ya Kanisa')
on conflict do nothing;
