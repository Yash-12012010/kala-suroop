
-- Create table for course files
CREATE TABLE public.course_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for class recordings
CREATE TABLE public.class_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  live_session_id UUID REFERENCES public.live_sessions(id),
  title TEXT NOT NULL,
  recording_url TEXT NOT NULL,
  duration INTEGER, -- duration in seconds
  recorded_by UUID REFERENCES auth.users,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for course_files
ALTER TABLE public.course_files ENABLE ROW LEVEL SECURITY;

-- Create policies for course_files (everyone can view, only admins can manage)
CREATE POLICY "Everyone can view course files" 
  ON public.course_files 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert course files" 
  ON public.course_files 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course files" 
  ON public.course_files 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course files" 
  ON public.course_files 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable RLS for class_recordings
ALTER TABLE public.class_recordings ENABLE ROW LEVEL SECURITY;

-- Create policies for class_recordings (everyone can view, only admins can manage)
CREATE POLICY "Everyone can view class recordings" 
  ON public.class_recordings 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert class recordings" 
  ON public.class_recordings 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update class recordings" 
  ON public.class_recordings 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete class recordings" 
  ON public.class_recordings 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for course files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-files', 'course-files', true);

-- Create storage bucket for recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('class-recordings', 'class-recordings', true);

-- Create storage policies for course files bucket
CREATE POLICY "Everyone can view course files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'course-files');

CREATE POLICY "Admins can upload course files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'course-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course files" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'course-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'course-files' AND public.has_role(auth.uid(), 'admin'));

-- Create storage policies for recordings bucket
CREATE POLICY "Everyone can view recordings" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'class-recordings');

CREATE POLICY "Admins can upload recordings" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'class-recordings' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update recordings" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'class-recordings' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete recordings" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'class-recordings' AND public.has_role(auth.uid(), 'admin'));
