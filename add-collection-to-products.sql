-- Add collection_id column to products table
-- This links products to specific collections

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS collection_id text;

-- Add foreign key constraint (optional but recommended)
-- ALTER TABLE public.products 
-- ADD CONSTRAINT fk_products_collection 
-- FOREIGN KEY (collection_id) REFERENCES public.collections(id) 
-- ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS products_collection_id_idx ON public.products(collection_id);

-- Insert Women's Day Collection (20/10)
INSERT INTO public.collections (id, name, description, end_date, discount, icon, features, status)
VALUES (
  'womens-day-2024',
  'Bộ Sưu Tập 20/10',
  'Bộ sưu tập đặc biệt dành tặng phụ nữ Việt Nam nhân ngày 20/10. Những món quà ý nghĩa để gửi gắm tình cảm đến người phụ nữ quan trọng trong cuộc đời bạn.',
  '2024-10-31T23:59:59Z',
  0,
  'fas fa-heart',
  '["Thiết kế độc quyền", "Màu sắc pastel nhẹ nhàng", "Quà tặng ý nghĩa", "Giao hàng đúng ngày 20/10"]'::jsonb,
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  end_date = EXCLUDED.end_date,
  discount = EXCLUDED.discount,
  icon = EXCLUDED.icon,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  updated_at = timezone('utc'::text, now());

-- Insert a Regular/Default Collection (always available)
INSERT INTO public.collections (id, name, description, end_date, discount, icon, features, status)
VALUES (
  'regular',
  'Bộ Sưu Tập Thường Xuyên',
  'Các sản phẩm thường xuyên luôn có sẵn để bạn lựa chọn.',
  NULL,
  0,
  'fas fa-star',
  '["Luôn có sẵn", "Đa dạng lựa chọn", "Chất lượng ổn định"]'::jsonb,
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = timezone('utc'::text, now());

-- Optionally: Set default collection_id for existing products
-- UPDATE public.products 
-- SET collection_id = 'regular' 
-- WHERE collection_id IS NULL;

COMMENT ON COLUMN public.products.collection_id IS 'ID of the collection this product belongs to';

