
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  payment_status: string;
  access_granted: boolean;
  enrolled_at: string | null;
  expires_at: string | null;
}

export const useCourseAccess = (courseId: string) => {
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !courseId) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Admins have access to all courses
      if (isAdmin) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (error) {
          console.error('Error checking course access:', error);
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // Map the data to match our interface if it exists
        const mappedEnrollment: CourseEnrollment | null = data ? {
          id: data.id,
          user_id: data.user_id,
          course_id: data.course_id,
          payment_status: data.payment_status,
          access_granted: data.access_granted,
          enrolled_at: data.enrolled_at,
          expires_at: data.expires_at
        } : null;

        setEnrollment(mappedEnrollment);

        // Check if user has valid access
        const hasValidAccess = mappedEnrollment && 
          mappedEnrollment.payment_status === 'paid' && 
          mappedEnrollment.access_granted && 
          (!mappedEnrollment.expires_at || new Date(mappedEnrollment.expires_at) > new Date());

        setHasAccess(!!hasValidAccess);
      } catch (error) {
        console.error('Error checking course access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, courseId, isAdmin]);

  return { hasAccess, enrollment, loading };
};
