-- Colors table for L'Gôu
-- Run this SQL in your Supabase SQL Editor to create the colors table

-- Colors table
create table if not exists public.colors (
  id text primary key,
  name text not null,
  hex_code text not null,
  category text not null, -- 'shirt' or 'trouser'
  quantity integer default 0 not null, -- Stock quantity for this color
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index for better performance
create index if not exists colors_category_idx on public.colors (category);
create index if not exists colors_active_idx on public.colors (is_active);

-- Add quantity column to existing colors table (if it doesn't exist)
alter table public.colors add column if not exists quantity integer default 0 not null;

-- Update existing colors with default quantity
update public.colors set quantity = 50 where quantity = 0 or quantity is null;

-- Insert default colors
insert into public.colors (id, name, hex_code, category, quantity) values
-- Shirt colors
('shirt_001', 'Be', '#d3c7a6', 'shirt', 50),
('shirt_002', 'Hồng Pastel', '#e3b0bc', 'shirt', 50),
('shirt_003', 'Vàng Mơ', '#5c5135', 'shirt', 50),
('shirt_004', 'Xám', '#858789', 'shirt', 50),
('shirt_005', 'Trắng', '#ffffff', 'shirt', 50),
('shirt_006', 'Đen', '#000000', 'shirt', 50),
('shirt_007', 'Xám Đậm', '#303548', 'shirt', 50),
('shirt_008', 'Xanh Pastel', '#bed9ff', 'shirt', 50),
('shirt_009', 'Tím', '#b2a0d3', 'shirt', 50),
('shirt_010', 'Đỏ Mận', '#553e34', 'shirt', 50),
('shirt_011', 'Xám Nhạt', '#505254', 'shirt', 50),

-- Trouser colors (same colors for now)
('trouser_001', 'Be', '#d3c7a6', 'trouser', 50),
('trouser_002', 'Hồng Pastel', '#e3b0bc', 'trouser', 50),
('trouser_003', 'Vàng Mơ', '#5c5135', 'trouser', 50),
('trouser_004', 'Xám', '#858789', 'trouser', 50),
('trouser_005', 'Trắng', '#ffffff', 'trouser', 50),
('trouser_006', 'Đen', '#000000', 'trouser', 50),
('trouser_007', 'Xám Đậm', '#303548', 'trouser', 50),
('trouser_008', 'Xanh Pastel', '#bed9ff', 'trouser', 50),
('trouser_009', 'Tím', '#b2a0d3', 'trouser', 50),
('trouser_010', 'Đỏ Mận', '#553e34', 'trouser', 50),
('trouser_011', 'Xám Nhạt', '#505254', 'trouser', 50)
on conflict (id) do nothing;
