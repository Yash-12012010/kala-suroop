
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Search, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  payment_status: string;
  access_granted: boolean;
  enrolled_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_email?: string;
  course_title?: string;
}

interface Course {
  id: string;
  title: string;
}

const CourseEnrollmentManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchEnrollments();
      fetchCourses();
    }
  }, [isAdmin]);

  const fetchEnrollments = async () => {
    try {
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('*')
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) {
        throw enrollmentError;
      }

      if (!enrollmentData) {
        setEnrollments([]);
        return;
      }

      // Process enrollments with proper error handling
      const enrichedEnrollments: CourseEnrollment[] = [];
      
      for (const enrollment of enrollmentData) {
        let userEmail = 'Unknown';
        let courseTitle = 'Unknown Course';

        // Get user email with proper error handling
        try {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(enrollment.user_id);
          if (!userError && userData?.user?.email) {
            userEmail = userData.user.email;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }

        // Get course title with proper error handling
        try {
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('title')
            .eq('id', enrollment.course_id)
            .single();
          
          if (!courseError && courseData?.title) {
            courseTitle = courseData.title;
          }
        } catch (error) {
          console.error('Error fetching course data:', error);
        }

        enrichedEnrollments.push({
          ...enrollment,
          user_email: userEmail,
          course_title: courseTitle
        });
      }

      setEnrollments(enrichedEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');

      if (error) {
        throw error;
      }

      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateEnrollment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const userEmail = formData.get('userEmail') as string;
    const courseId = formData.get('courseId') as string;
    const paymentStatus = formData.get('paymentStatus') as string;
    const accessGranted = formData.get('accessGranted') === 'true';
    const expiresAt = formData.get('expiresAt') as string;

    try {
      // Get user ID from auth users with proper type handling
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        throw usersError;
      }

      // Find user with proper type checking
      const targetUser = usersData.users.find((user: any) => user.email === userEmail);
      
      if (!targetUser) {
        toast({
          title: "Error",
          description: "User not found with that email",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: targetUser.id,
          course_id: courseId,
          payment_status: paymentStatus,
          access_granted: accessGranted,
          expires_at: expiresAt || null
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Enrollment created successfully",
      });

      setEnrollmentDialogOpen(false);
      fetchEnrollments();
    } catch (error) {
      console.error('Error creating enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to create enrollment",
        variant: "destructive"
      });
    }
  };

  const updateEnrollmentStatus = async (enrollmentId: string, updates: Partial<CourseEnrollment>) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update(updates)
        .eq('id', enrollmentId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Enrollment updated successfully",
      });

      fetchEnrollments();
    } catch (error) {
      console.error('Error updating enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to update enrollment",
        variant: "destructive"
      });
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course Enrollments</h2>
        <Dialog open={enrollmentDialogOpen} onOpenChange={setEnrollmentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Enrollment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Enrollment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEnrollment} className="space-y-4">
              <div>
                <Label htmlFor="userEmail">User Email</Label>
                <Input id="userEmail" name="userEmail" type="email" required />
              </div>
              <div>
                <Label htmlFor="courseId">Course</Label>
                <Select name="courseId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select name="paymentStatus" defaultValue="pending">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="accessGranted">Access Granted</Label>
                <Select name="accessGranted" defaultValue="false">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input id="expiresAt" name="expiresAt" type="datetime-local" />
              </div>
              <Button type="submit" className="w-full">Create Enrollment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user email or course title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredEnrollments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Enrollments Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'No enrollments match your search.' : 'No course enrollments have been created yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{enrollment.course_title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{enrollment.user_email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={enrollment.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>
                      {enrollment.payment_status}
                    </Badge>
                    <Badge className={enrollment.access_granted ? 'bg-green-500' : 'bg-red-500'}>
                      {enrollment.access_granted ? 'Access Granted' : 'No Access'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </div>
                  {enrollment.expires_at && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Expires: {new Date(enrollment.expires_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateEnrollmentStatus(enrollment.id, { access_granted: !enrollment.access_granted })}
                  >
                    {enrollment.access_granted ? 'Revoke Access' : 'Grant Access'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateEnrollmentStatus(enrollment.id, { 
                      payment_status: enrollment.payment_status === 'paid' ? 'pending' : 'paid' 
                    })}
                  >
                    Mark as {enrollment.payment_status === 'paid' ? 'Pending' : 'Paid'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseEnrollmentManager;
