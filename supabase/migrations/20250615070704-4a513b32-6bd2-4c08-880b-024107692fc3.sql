
-- Insert a test course with the specific ID you're trying to access
INSERT INTO public.courses (
  id,
  title,
  description,
  instructor,
  level,
  duration,
  price,
  status,
  featured,
  enrolled_students
) VALUES (
  '8d6a9324-a3cd-43de-b024-25ed833b030b',
  'Test Course for Debugging',
  'This is a test course created to debug the course detail page routing.',
  'Test Instructor',
  'beginner',
  '10 hours',
  0,
  'active',
  true,
  5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- Also insert a few more sample courses for testing
INSERT INTO public.courses (
  title,
  description,
  instructor,
  level,
  duration,
  price,
  status,
  featured,
  enrolled_students
) VALUES 
(
  'React Fundamentals',
  'Learn the basics of React development',
  'John Doe',
  'beginner',
  '20 hours',
  999,
  'active',
  false,
  12
),
(
  'Advanced JavaScript',
  'Master advanced JavaScript concepts',
  'Jane Smith',
  'advanced',
  '30 hours',
  1499,
  'active',
  true,
  8
),
(
  'Web Development Bootcamp',
  'Complete web development course from scratch',
  'Mike Johnson',
  'intermediate',
  '60 hours',
  2999,
  'active',
  true,
  25
) ON CONFLICT (id) DO NOTHING;
