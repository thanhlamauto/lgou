-- Colors table for L'Gôu
-- Run this SQL in your Supabase SQL Editor to create the colors table

-- Colors table
create table if not exists public.colors (
  id text primary key,
  name text not null,
  hex_code text not null,
  category text not null, -- 'shirt' or 'trouser'
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index for better performance
create index if not exists colors_category_idx on public.colors (category);
create index if not exists colors_active_idx on public.colors (is_active);

-- Insert default colors
insert into public.colors (id, name, hex_code, category) values
-- Shirt colors
('shirt_001', 'Be', '#d3c7a6', 'shirt'),
('shirt_002', 'Hồng Pastel', '#e3b0bc', 'shirt'),
('shirt_003', 'Vàng Mơ', '#5c5135', 'shirt'),
('shirt_004', 'Xám', '#858789', 'shirt'),
('shirt_005', 'Trắng', '#ffffff', 'shirt'),
('shirt_006', 'Đen', '#000000', 'shirt'),
('shirt_007', 'Xám Đậm', '#303548', 'shirt'),
('shirt_008', 'Xanh Pastel', '#bed9ff', 'shirt'),
('shirt_009', 'Tím', '#b2a0d3', 'shirt'),
('shirt_010', 'Đỏ Mận', '#553e34', 'shirt'),
('shirt_011', 'Xám Nhạt', '#505254', 'shirt'),

-- Trouser colors (same colors for now)
('trouser_001', 'Be', '#d3c7a6', 'trouser'),
('trouser_002', 'Hồng Pastel', '#e3b0bc', 'trouser'),
('trouser_003', 'Vàng Mơ', '#5c5135', 'trouser'),
('trouser_004', 'Xám', '#858789', 'trouser'),
('trouser_005', 'Trắng', '#ffffff', 'trouser'),
('trouser_006', 'Đen', '#000000', 'trouser'),
('trouser_007', 'Xám Đậm', '#303548', 'trouser'),
('trouser_008', 'Xanh Pastel', '#bed9ff', 'trouser'),
('trouser_009', 'Tím', '#b2a0d3', 'trouser'),
('trouser_010', 'Đỏ Mận', '#553e34', 'trouser'),
('trouser_011', 'Xám Nhạt', '#505254', 'trouser')
on conflict (id) do nothing;
