import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, FileText, Video, Calendar, Star } from 'lucide-react';
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
  created_at: string;
  updated_at: string;
  enrolled_students: number | null;
}

const CourseManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    level: 'beginner',
    duration: '',
    price: 0,
    status: 'active',
    featured: false,
    enrolled_students: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
      
      return data as Course[];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: formData.title,
            description: formData.description,
            instructor: formData.instructor,
            level: formData.level,
            duration: formData.duration,
            price: formData.price,
            status: formData.status,
            featured: formData.featured,
            enrolled_students: formData.enrolled_students,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([{
            title: formData.title,
            description: formData.description,
            instructor: formData.instructor,
            level: formData.level,
            duration: formData.duration,
            price: formData.price,
            status: formData.status,
            featured: formData.featured,
            enrolled_students: formData.enrolled_students
          }]);

        if (error) throw error;
        toast({ title: "Success", description: "Course created successfully" });
      }

      // Refetch courses
      queryClient.invalidateQueries({ queryKey: ['courses'] });

      setFormData({
        title: '',
        description: '',
        instructor: '',
        level: 'beginner',
        duration: '',
        price: 0,
        status: 'active',
        featured: false,
        enrolled_students: 0
      });
      setEditingCourse(null);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Failed to save course",
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

      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ 
        title: "Success", 
        description: `Course ${!course.featured ? 'added to' : 'removed from'} featured list` 
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Success", description: "Course deleted successfully" });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const openDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description || '',
        instructor: course.instructor,
        level: course.level,
        duration: course.duration || '',
        price: course.price,
        status: course.status,
        featured: course.featured,
        enrolled_students: course.enrolled_students || 0
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        instructor: '',
        level: 'beginner',
        duration: '',
        price: 0,
        status: 'active',
        featured: false,
        enrolled_students: 0
      });
    }
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-lg">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Course Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter course title"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter course description"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Instructor</Label>
                    <Input
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      placeholder="Enter instructor name"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Level</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 80 hours"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      placeholder="Enter price"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Enrolled Students</Label>
                    <Input
                      type="number"
                      value={formData.enrolled_students}
                      onChange={(e) => setFormData({ ...formData, enrolled_students: parseInt(e.target.value) || 0 })}
                      placeholder="Number of students"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      Featured Course
                    </Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    {editingCourse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No courses found</p>
              <Button onClick={() => openDialog()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Details</TableHead>
                    <TableHead className="hidden sm:table-cell">Instructor</TableHead>
                    <TableHead className="hidden md:table-cell">Level</TableHead>
                    <TableHead className="hidden lg:table-cell">Students</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm sm:text-base">{course.title}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                            {course.description?.substring(0, 60)}...
                          </div>
                          <div className="sm:hidden mt-1 space-y-1">
                            <Badge variant="outline" className="text-xs capitalize">{course.level}</Badge>
                            <span className="text-xs text-muted-foreground block">{course.instructor}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{course.instructor}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="capitalize">{course.level}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {course.enrolled_students || 0}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">₹{course.price}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(course)}
                          className="p-2"
                        >
                          <Star 
                            className={`h-4 w-4 ${course.featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog(course)}
                            className="p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(course.id)}
                            className="p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Courses:</span>
                <span className="font-semibold text-lg">{courses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Featured:</span>
                <span className="font-semibold text-lg text-yellow-600">
                  {courses.filter(c => c.featured).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active:</span>
                <span className="font-semibold text-lg text-green-600">
                  {courses.filter(c => c.status === 'active').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Video className="h-5 w-5 mr-2 text-purple-600" />
              Course Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" size="sm">
              Bulk Import Courses
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              Export Course Data
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              Generate Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Featured Courses:</span>
                <span className="font-medium">{courses.filter(c => c.featured).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseManager;
