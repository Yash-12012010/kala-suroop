
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Star, Users, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string;
  level: string;
  duration: string | null;
  price: number;
  status: string;
  featured: boolean;
  enrolled_students: number | null;
  created_at: string;
  updated_at: string;
}

const CourseManager = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    level: 'beginner',
    duration: '',
    price: 0,
    featured: false
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      level: 'beginner',
      duration: '',
      price: 0,
      featured: false
    });
    setSelectedCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedCourse) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCourse.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course updated successfully"
        });
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([{
            ...formData,
            status: 'active'
          }]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course created successfully"
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      instructor: course.instructor,
      level: course.level,
      duration: course.duration || '',
      price: course.price,
      featured: course.featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Course deleted successfully"
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (course: Course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ featured: !course.featured })
        .eq('id', course.id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      toast({
        title: "Success",
        description: `Course ${!course.featured ? 'featured' : 'unfeatured'} successfully`
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Course Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your courses and content
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCourse ? 'Edit Course' : 'Add New Course'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="specialized">Specialized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 40-80 hours"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    min="0"
                    className="mt-1"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="featured">Featured Course</Label>
                  </div>
                </div>
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
                  {selectedCourse ? 'Update' : 'Create'} Course
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold truncate mb-2">
                    {course.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {course.level}
                    </Badge>
                    {course.featured && (
                      <Badge className="text-xs bg-yellow-500 hover:bg-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{course.enrolled_students || 0} students</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">₹{course.price}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 col-span-2">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{course.duration || 'Duration not set'}</span>
                </div>
              </div>
              
              {/* Instructor */}
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Instructor: </span>
                <span className="text-gray-600 dark:text-gray-400">{course.instructor}</span>
              </div>
              
              {/* Description */}
              {course.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>
              )}
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(course)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(course)}
                  className="flex-1"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {course.featured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No courses found</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
