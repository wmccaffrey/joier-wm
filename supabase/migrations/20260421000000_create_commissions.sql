-- JOIER commissions table
-- Stores all commission inquiries submitted via joier.art

create table if not exists commissions (
  id               bigserial primary key,
  order_reference  text        not null unique,
  name             text        not null,
  contact_type     text,
  contact_handle   text,
  piece_type       text,
  metal_pref       text,
  budget           text,
  message          text,
  submitted_at     timestamptz not null default now()
);

-- Index for quick lookup by reference number
create index if not exists commissions_order_reference_idx
  on commissions (order_reference);

-- RLS: only service role can read/write (form submissions use service key internally)
alter table commissions enable row level security;

-- Allow the edge function (service role) full access
create policy "service role full access"
  on commissions
  for all
  to service_role
  using (true)
  with check (true);
