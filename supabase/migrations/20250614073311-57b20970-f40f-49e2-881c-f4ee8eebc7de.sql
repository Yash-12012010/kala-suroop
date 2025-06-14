
-- Create course_purchases table
CREATE TABLE public.course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create live_sessions table
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  agora_channel TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_purchases
CREATE POLICY "Users can view their own purchases" 
  ON public.course_purchases 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" 
  ON public.course_purchases 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for live_sessions
CREATE POLICY "Everyone can view live sessions" 
  ON public.live_sessions 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify live sessions" 
  ON public.live_sessions 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Make the specified email an admin
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = '5513@dhsajmerroad.org';
  
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
