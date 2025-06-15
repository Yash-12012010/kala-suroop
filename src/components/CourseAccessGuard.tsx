
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isAdmin } = useAuth();

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

  // Show access restriction message
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl text-orange-800 dark:text-orange-200">
            Course Access Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-orange-700 dark:text-orange-300">
            You need to purchase access to view the content for <strong>{courseName}</strong>.
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
              onClick={() => {
                // In a real app, this would redirect to payment page
                alert('Payment integration would be implemented here');
              }}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Purchase Course Access
            </Button>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contact support if you believe you should have access to this course.
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
