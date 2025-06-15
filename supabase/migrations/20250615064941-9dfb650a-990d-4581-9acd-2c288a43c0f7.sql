
-- Add enrolled_students column to courses table
ALTER TABLE public.courses 
ADD COLUMN enrolled_students integer DEFAULT 0;
