
-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, class_id)
);

-- Create topics table
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, subject_id)
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- RLS policies for classes
CREATE POLICY "Everyone can view classes" 
  ON public.classes 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify classes" 
  ON public.classes 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for subjects
CREATE POLICY "Everyone can view subjects" 
  ON public.subjects 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify subjects" 
  ON public.subjects 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for topics
CREATE POLICY "Everyone can view topics" 
  ON public.topics 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify topics" 
  ON public.topics 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert some initial data
INSERT INTO public.classes (name, description) VALUES
('Class 9', 'Grade 9 curriculum'),
('Class 10', 'Grade 10 curriculum'),
('Class 11', 'Grade 11 curriculum'),
('Class 12', 'Grade 12 curriculum');

-- Insert some subjects for Class 10
INSERT INTO public.subjects (name, description, class_id) 
SELECT 'Mathematics', 'Advanced mathematics concepts', id FROM public.classes WHERE name = 'Class 10'
UNION ALL
SELECT 'Physics', 'Physics fundamentals and applications', id FROM public.classes WHERE name = 'Class 10'
UNION ALL
SELECT 'Chemistry', 'Chemical reactions and molecular structures', id FROM public.classes WHERE name = 'Class 10'
UNION ALL
SELECT 'Biology', 'Life sciences and biological processes', id FROM public.classes WHERE name = 'Class 10'
UNION ALL
SELECT 'English', 'Language arts and literature', id FROM public.classes WHERE name = 'Class 10';

-- Insert some topics for Mathematics in Class 10
INSERT INTO public.topics (name, description, subject_id, order_index)
SELECT 'Algebra', 'Linear equations and polynomials', s.id, 1
FROM public.subjects s 
JOIN public.classes c ON s.class_id = c.id 
WHERE s.name = 'Mathematics' AND c.name = 'Class 10'
UNION ALL
SELECT 'Geometry', 'Shapes, angles, and proofs', s.id, 2
FROM public.subjects s 
JOIN public.classes c ON s.class_id = c.id 
WHERE s.name = 'Mathematics' AND c.name = 'Class 10'
UNION ALL
SELECT 'Trigonometry', 'Sine, cosine, and tangent functions', s.id, 3
FROM public.subjects s 
JOIN public.classes c ON s.class_id = c.id 
WHERE s.name = 'Mathematics' AND c.name = 'Class 10';
