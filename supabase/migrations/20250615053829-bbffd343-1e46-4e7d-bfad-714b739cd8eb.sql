
-- Create a table for products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to control access
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view products (public store)
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Create policy that allows only authenticated users to insert products
CREATE POLICY "Authenticated users can create products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy that allows only authenticated users to update products
CREATE POLICY "Authenticated users can update products" 
  ON public.products 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create policy that allows only authenticated users to delete products
CREATE POLICY "Authenticated users can delete products" 
  ON public.products 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO public.products (title, image, price, original_price, in_stock, category, description) VALUES
('Professional Watercolor Paint Set', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop', 2499, 3999, true, 'Art Supplies', 'High-quality watercolor paints for professional artists'),
('Premium Canvas Set - Various Sizes', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop', 1899, 2999, true, 'Canvas & Paper', 'Professional canvas set in multiple sizes'),
('Acrylic Paint Brushes Collection', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop', 1299, 1899, false, 'Brushes', 'Complete set of acrylic paint brushes'),
('Art Supplies Organizer Kit', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=250&fit=crop', 1599, 2299, true, 'Storage', 'Keep your art supplies organized and accessible');
