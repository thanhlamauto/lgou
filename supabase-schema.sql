-- L'Gôu Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension (if not already enabled)
create extension if not exists "uuid-ossp";

-- Orders table
create table if not exists public.orders (
  id text primary key,
  customer_name text,
  customer_phone text,
  customer_email text,
  customer_address text,
  items jsonb default '[]'::jsonb,
  total numeric default 0,
  status text default 'new',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Customers table
create table if not exists public.customers (
  id text primary key,
  name text,
  phone text,
  email text,
  address text,
  orders jsonb default '[]'::jsonb,
  total_orders integer default 0,
  first_order timestamp with time zone,
  last_order timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Products table
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text,
  price numeric default 0,
  stock integer default 5,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Collections table
create table if not exists public.collections (
  id text primary key,
  name text not null,
  description text,
  end_date timestamp with time zone,
  discount numeric default 0,
  icon text default 'fas fa-star',
  features jsonb default '[]'::jsonb,
  limited_products jsonb default '[]'::jsonb,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Daily stats table
create table if not exists public.daily_stats (
  date date primary key,
  orders integer default 0,
  revenue numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create indexes for better performance
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists customers_last_order_idx on public.customers(last_order desc);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_stock_idx on public.products(stock);
create index if not exists collections_end_date_idx on public.collections(end_date);
create index if not exists daily_stats_date_idx on public.daily_stats(date desc);

-- Enable Row Level Security (RLS) but allow all operations for now
-- You can customize these policies later for better security
alter table public.orders enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.collections enable row level security;
alter table public.daily_stats enable row level security;

-- Create policies to allow all operations (you can refine these later)
create policy "Enable all operations for orders" on public.orders for all using (true) with check (true);
create policy "Enable all operations for customers" on public.customers for all using (true) with check (true);
create policy "Enable all operations for products" on public.products for all using (true) with check (true);
create policy "Enable all operations for collections" on public.collections for all using (true) with check (true);
create policy "Enable all operations for daily_stats" on public.daily_stats for all using (true) with check (true);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_orders_updated_at before update on public.orders
  for each row execute procedure public.handle_updated_at();

create trigger handle_customers_updated_at before update on public.customers
  for each row execute procedure public.handle_updated_at();

create trigger handle_products_updated_at before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger handle_collections_updated_at before update on public.collections
  for each row execute procedure public.handle_updated_at();

create trigger handle_daily_stats_updated_at before update on public.daily_stats
  for each row execute procedure public.handle_updated_at();

-- Grant access to authenticated and anon users
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- Insert some example data (optional - for testing)
-- You can remove this section if you want to start with an empty database

comment on table public.orders is 'Customer orders';
comment on table public.customers is 'Customer information and history';
comment on table public.products is 'Product catalog with inventory';
comment on table public.collections is 'Limited edition collections';
comment on table public.daily_stats is 'Daily business statistics';

