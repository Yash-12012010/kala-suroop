
-- First, create the course_enrollments table with correct types
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL, -- Changed from UUID to TEXT to match courses table
  payment_status TEXT NOT NULL DEFAULT 'pending',
  access_granted BOOLEAN NOT NULL DEFAULT false,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on course_enrollments
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_enrollments
CREATE POLICY "Users can view their own enrollments" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments" 
  ON public.course_enrollments 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enable RLS on courses table (it wasn't enabled before)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow everyone to see course listings (for browsing) but restrict detailed access through the frontend
CREATE POLICY "Everyone can view course listings" 
  ON public.courses 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Update live_sessions policy to be more restrictive
DROP POLICY IF EXISTS "Users can view live sessions for accessible courses" ON public.live_sessions;
CREATE POLICY "Users can view live sessions for accessible courses" 
  ON public.live_sessions 
  FOR SELECT 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce 
      WHERE ce.user_id = auth.uid() 
      AND ce.course_id = live_sessions.course_id 
      AND ce.payment_status = 'paid' 
      AND ce.access_granted = true
      AND (ce.expires_at IS NULL OR ce.expires_at > NOW())
    )
  );

-- Update course_files policy to be more restrictive
DROP POLICY IF EXISTS "Users can view files for accessible courses" ON public.course_files;
CREATE POLICY "Users can view files for accessible courses" 
  ON public.course_files 
  FOR SELECT 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce 
      WHERE ce.user_id = auth.uid() 
      AND ce.course_id = course_files.course_id 
      AND ce.payment_status = 'paid' 
      AND ce.access_granted = true
      AND (ce.expires_at IS NULL OR ce.expires_at > NOW())
    )
  );

-- Update class_recordings policy to be more restrictive
DROP POLICY IF EXISTS "Users can view recordings for accessible courses" ON public.class_recordings;
CREATE POLICY "Users can view recordings for accessible courses" 
  ON public.class_recordings 
  FOR SELECT 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce 
      WHERE ce.user_id = auth.uid() 
      AND ce.course_id = class_recordings.course_id 
      AND ce.payment_status = 'paid' 
      AND ce.access_granted = true
      AND (ce.expires_at IS NULL OR ce.expires_at > NOW())
    )
  );
