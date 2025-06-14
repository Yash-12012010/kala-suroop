
-- Create table for website banners
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  position TEXT NOT NULL DEFAULT 'top', -- top, bottom, sidebar, popup
  priority INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create table for dynamic navigation items
CREATE TABLE public.navigation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  icon TEXT,
  parent_id UUID REFERENCES public.navigation_items(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  required_role TEXT DEFAULT 'user',
  is_external BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for website settings/configuration
CREATE TABLE public.website_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create table for dynamic page content
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(page_slug, section_key)
);

-- Create table for announcements/notifications
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, success, error
  target_audience TEXT NOT NULL DEFAULT 'all', -- all, students, teachers, admins
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add RLS policies for banners (only admins can manage)
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners" 
  ON public.banners 
  FOR SELECT 
  USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

CREATE POLICY "Admins can manage all banners" 
  ON public.banners 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for navigation items
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active navigation items" 
  ON public.navigation_items 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage navigation items" 
  ON public.navigation_items 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for website settings
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public settings" 
  ON public.website_settings 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Admins can manage all settings" 
  ON public.website_settings 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for page content
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active page content" 
  ON public.page_content 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage page content" 
  ON public.page_content 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active announcements" 
  ON public.announcements 
  FOR SELECT 
  USING (is_active = true AND (expires_at IS NULL OR expires_at >= now()));

CREATE POLICY "Admins can manage announcements" 
  ON public.announcements 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default navigation items
INSERT INTO public.navigation_items (name, path, order_index, required_role) VALUES
  ('Home', '/', 0, 'user'),
  ('Dashboard', '/dashboard', 1, 'user'),
  ('Art Classes', '/courses', 2, 'user'),
  ('Art Store', '/store', 3, 'user'),
  ('Schedule', '/timetable', 4, 'user'),
  ('Updates', '/announcements', 5, 'user');

-- Insert default website settings
INSERT INTO public.website_settings (key, value, description, category, is_public) VALUES
  ('site_title', '"Kala Suroop"', 'Main website title', 'branding', true),
  ('site_subtitle', '"Art Academy"', 'Website subtitle', 'branding', true),
  ('site_logo_url', '""', 'URL to site logo', 'branding', true),
  ('primary_color', '"orange"', 'Primary brand color', 'styling', true),
  ('secondary_color', '"pink"', 'Secondary brand color', 'styling', true),
  ('accent_color', '"purple"', 'Accent color', 'styling', true),
  ('show_user_first_name', 'true', 'Show user first name in navbar instead of email', 'display', false),
  ('max_display_name_length', '20', 'Maximum characters for display names', 'display', false);
