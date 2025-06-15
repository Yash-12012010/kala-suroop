
-- Add featured column to courses table
ALTER TABLE public.courses 
ADD COLUMN featured boolean NOT NULL DEFAULT false;

-- Add index for better performance when querying featured courses
CREATE INDEX idx_courses_featured ON public.courses(featured) WHERE featured = true;
