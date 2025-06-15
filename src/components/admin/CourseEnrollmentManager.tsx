
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  payment_status: string;
  access_granted: boolean;
  enrolled_at: string;
  expires_at: string | null;
  profiles?: {
    full_name: string;
  };
  courses?: {
    title: string;
  };
}

const CourseEnrollmentManager = () => {
  const [selectedEnrollment, setSelectedEnrollment] = useState<CourseEnrollment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    user_email: '',
    course_id: '',
    payment_status: 'paid',
    access_granted: true,
    expires_at: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['course-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          profiles(full_name),
          courses(title)
        `)
        .order('enrolled_at', { ascending: false });
      
      if (error) throw error;
      return data as CourseEnrollment[];
    }
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['admin-courses-for-enrollment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('status', 'active')
        .order('title');
      
      if (error) throw error;
      return data;
    }
  });

  const resetForm = () => {
    setFormData({
      user_email: '',
      course_id: '',
      payment_status: 'paid',
      access_granted: true,
      expires_at: ''
    });
    setSelectedEnrollment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedEnrollment) {
        // Update existing enrollment
        const { error } = await supabase
          .from('course_enrollments')
          .update({
            payment_status: formData.payment_status,
            access_granted: formData.access_granted,
            expires_at: formData.expires_at || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedEnrollment.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Enrollment updated successfully"
        });
      } else {
        // Create new enrollment - would need to look up user by email first
        toast({
          title: "Info",
          description: "New enrollment creation requires user lookup by email",
          variant: "destructive"
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to save enrollment",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (enrollment: CourseEnrollment) => {
    setSelectedEnrollment(enrollment);
    setFormData({
      user_email: '', // Would need to fetch email from auth.users
      course_id: enrollment.course_id,
      payment_status: enrollment.payment_status,
      access_granted: enrollment.access_granted,
      expires_at: enrollment.expires_at ? enrollment.expires_at.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('id', enrollmentId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Enrollment deleted successfully"
      });
      
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to delete enrollment",
        variant: "destructive"
      });
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Enrollments
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage student course access and payments
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Enrollment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedEnrollment ? 'Edit Enrollment' : 'Add New Enrollment'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedEnrollment && (
                <div>
                  <Label htmlFor="user_email">User Email</Label>
                  <Input
                    id="user_email"
                    type="email"
                    value={formData.user_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="course_id">Course</Label>
                <Select value={formData.course_id} onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}>
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select value={formData.payment_status} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}>
                  <SelectTrigger className="mt-1">
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="access_granted"
                    checked={formData.access_granted}
                    onChange={(e) => setFormData(prev => ({ ...prev, access_granted: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="access_granted">Grant Access</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="expires_at">Expires At (Optional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {selectedEnrollment ? 'Update' : 'Create'} Enrollment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute h-4 w-4 top-1/2 left-3 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Search enrollments..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Enrollments List */}
      <div className="space-y-4">
        {filteredEnrollments.map((enrollment) => (
          <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold">
                      {enrollment.profiles?.full_name || 'Unknown User'}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {enrollment.courses?.title || 'Unknown Course'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <Badge className={
                      enrollment.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      enrollment.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {enrollment.payment_status}
                    </Badge>
                    
                    <Badge className={enrollment.access_granted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {enrollment.access_granted ? 'Access Granted' : 'Access Denied'}
                    </Badge>
                    
                    <span>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                    
                    {enrollment.expires_at && (
                      <span>Expires: {new Date(enrollment.expires_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(enrollment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(enrollment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No enrollments found</p>
        </div>
      )}
    </div>
  );
};

export default CourseEnrollmentManager;
