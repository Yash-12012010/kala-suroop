
-- Create a table for courses
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  duration TEXT,
  level TEXT NOT NULL DEFAULT 'beginner',
  status TEXT NOT NULL DEFAULT 'active',
  instructor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to control access
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view courses (public access)
CREATE POLICY "Anyone can view courses" 
  ON public.courses 
  FOR SELECT 
  USING (true);

-- Create policy that allows only authenticated users to insert courses
CREATE POLICY "Authenticated users can create courses" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy that allows only authenticated users to update courses
CREATE POLICY "Authenticated users can update courses" 
  ON public.courses 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create policy that allows only authenticated users to delete courses
CREATE POLICY "Authenticated users can delete courses" 
  ON public.courses 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some sample course data
INSERT INTO public.courses (title, description, price, duration, level, status, instructor) VALUES
('Mathematics Foundation', 'Complete foundation course for mathematics covering algebra, geometry, and basic calculus', 4999, '6 months', 'beginner', 'active', 'Dr. Sarah Johnson'),
('Advanced Physics', 'Advanced physics course covering quantum mechanics, thermodynamics, and electromagnetic theory', 7999, '8 months', 'advanced', 'active', 'Prof. Michael Chen'),
('Computer Science Basics', 'Introduction to programming, data structures, and algorithms', 5999, '4 months', 'beginner', 'active', 'Ms. Emily Rodriguez'),
('Chemistry Lab', 'Practical chemistry course with hands-on laboratory experience', 6499, '5 months', 'intermediate', 'draft', 'Dr. James Wilson');
