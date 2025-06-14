
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create timetable table
CREATE TABLE public.timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_name TEXT NOT NULL,
  teacher TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (day_of_week, time_slot)
);

-- Enable RLS on timetable
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- RLS policies for timetable
CREATE POLICY "Everyone can view timetable" 
  ON public.timetable 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify timetable" 
  ON public.timetable 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert the current timetable data
INSERT INTO public.timetable (day_of_week, time_slot, subject, class_name, teacher) VALUES
('Monday', '09:00 AM', 'Mathematics', 'Class 10', 'Mr. Kumar'),
('Monday', '11:00 AM', 'Physics', 'Class 11', 'Dr. Sharma'),
('Monday', '03:00 PM', 'Chemistry', 'Class 9', 'Ms. Patel'),
('Tuesday', '10:00 AM', 'English', 'Class 10', 'Mrs. Singh'),
('Tuesday', '02:00 PM', 'Biology', 'Class 11', 'Dr. Verma'),
('Tuesday', '04:00 PM', 'Mathematics', 'Class 9', 'Mr. Kumar'),
('Wednesday', '09:00 AM', 'Chemistry', 'Class 11', 'Ms. Patel'),
('Wednesday', '11:00 AM', 'Physics', 'Class 10', 'Dr. Sharma'),
('Wednesday', '03:00 PM', 'English', 'Class 9', 'Mrs. Singh'),
('Thursday', '10:00 AM', 'Mathematics', 'Class 11', 'Mr. Kumar'),
('Thursday', '12:00 PM', 'Biology', 'Class 10', 'Dr. Verma'),
('Thursday', '04:00 PM', 'Physics', 'Class 9', 'Dr. Sharma'),
('Friday', '09:00 AM', 'English', 'Class 11', 'Mrs. Singh'),
('Friday', '11:00 AM', 'Chemistry', 'Class 10', 'Ms. Patel'),
('Friday', '02:00 PM', 'Mathematics', 'Class 9', 'Mr. Kumar'),
('Saturday', '10:00 AM', 'Doubt Session', 'All Classes', 'All Teachers'),
('Saturday', '02:00 PM', 'Test Series', 'Class 10', 'Academic Team'),
('Sunday', '11:00 AM', 'Revision Class', 'Class 11', 'All Teachers');

-- Function to assign admin role to first user (for testing)
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first user from profiles
  SELECT id INTO first_user_id FROM public.profiles ORDER BY created_at ASC LIMIT 1;
  
  IF first_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (first_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

-- Make the first user an admin (for testing purposes)
SELECT public.make_first_user_admin();
