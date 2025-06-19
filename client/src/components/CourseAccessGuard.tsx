
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseAccessGuardProps {
  courseId: string;
  courseName: string;
  coursePrice: number;
  children: React.ReactNode;
}

const CourseAccessGuard: React.FC<CourseAccessGuardProps> = ({
  courseId,
  courseName,
  coursePrice,
  children
}) => {
  const { hasAccess, enrollment, loading } = useCourseAccess(courseId);
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const [enrolling, setEnrolling] = useState(false);

  const handleEnrollNow = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in this course",
        variant: "destructive"
      });
      return;
    }

    setEnrolling(true);
    
    try {
      // Create enrollment record
      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          payment_status: 'pending',
          access_granted: false
        });

      if (enrollmentError) {
        throw enrollmentError;
      }

      // Simulate payment process (replace with actual payment integration)
      setTimeout(() => {
        toast({
          title: "Enrollment Successful!",
          description: "You have been enrolled in the course. Payment processing will be completed shortly.",
        });
        
        // Update enrollment to paid status (in real implementation, this would be done via webhook)
        supabase
          .from('course_enrollments')
          .update({ 
            payment_status: 'paid', 
            access_granted: true 
          })
          .eq('user_id', user.id)
          .eq('course_id', courseId);
        
        setEnrolling(false);
        
        // Refresh the page to update access
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Enrollment Failed",
        description: "There was an error processing your enrollment. Please try again.",
        variant: "destructive"
      });
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user has access or is admin, show the content
  if (hasAccess || isAdmin) {
    return <>{children}</>;
  }

  // Show enrollment prompt
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl text-orange-800 dark:text-orange-200">
            Enroll in Course
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-orange-700 dark:text-orange-300">
            Enroll in <strong>{courseName}</strong> to access all course content, live sessions, and recordings.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
              <CreditCard className="h-4 w-4 mr-2" />
              ₹{coursePrice}
            </Badge>
          </div>

          {enrollment && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h3 className="font-semibold mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Enrollment Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <Badge className={enrollment.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {enrollment.payment_status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Access Granted:</span>
                  <Badge className={enrollment.access_granted ? 'bg-green-500' : 'bg-red-500'}>
                    {enrollment.access_granted ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {enrollment.expires_at && (
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span>{new Date(enrollment.expires_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700"
              onClick={handleEnrollNow}
              disabled={enrolling}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {enrolling ? 'Processing...' : 'Enroll Now'}
            </Button>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Secure payment processing. Contact support if you need assistance.
            </p>
          </div>

          <div className="border-t pt-4 mt-6">
            <h4 className="font-semibold mb-2 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              What You'll Get:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Access to all course materials</li>
              <li>• Live session recordings</li>
              <li>• Downloadable resources</li>
              <li>• Interactive assignments</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAccessGuard;
