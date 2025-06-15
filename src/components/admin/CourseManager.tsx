
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText, Video, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  status: string;
  instructor: string;
  created_at: string;
}

const CourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'beginner',
    status: 'active',
    instructor: ''
  });
  const { toast } = useToast();

  // Mock course data for demonstration
  const mockCourses: Course[] = [
    {
      id: 'neet-2025',
      title: 'NEET 2025 Complete Course',
      description: 'Comprehensive preparation for NEET 2025 with live classes and doubt sessions',
      price: 15000,
      duration: '12 months',
      level: 'intermediate',
      status: 'active',
      instructor: 'Dr. Sharma',
      created_at: new Date().toISOString()
    },
    {
      id: 'jee-main-2025',
      title: 'JEE Main 2025 Foundation',
      description: 'Complete JEE Main preparation with test series and revision classes',
      price: 18000,
      duration: '10 months',
      level: 'advanced',
      status: 'active',
      instructor: 'Mr. Kumar',
      created_at: new Date().toISOString()
    },
    {
      id: 'class-12-physics',
      title: 'Class 12 Physics',
      description: 'Complete Class 12 Physics course with practical sessions',
      price: 8000,
      duration: '8 months',
      level: 'intermediate',
      status: 'active',
      instructor: 'Dr. Patel',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // For now, using mock data. In a real implementation, you would fetch from database
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        // Update existing course
        const updatedCourses = courses.map(course =>
          course.id === editingCourse.id
            ? { ...course, ...formData }
            : course
        );
        setCourses(updatedCourses);
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        // Create new course
        const newCourse: Course = {
          id: `course-${Date.now()}`,
          ...formData,
          created_at: new Date().toISOString()
        };
        setCourses([...courses, newCourse]);
        toast({ title: "Success", description: "Course created successfully" });
      }

      setFormData({
        title: '',
        description: '',
        price: 0,
        duration: '',
        level: 'beginner',
        status: 'active',
        instructor: ''
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
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
        description: course.description,
        price: course.price,
        duration: course.duration,
        level: course.level,
        status: course.status,
        instructor: course.instructor
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        duration: '',
        level: 'beginner',
        status: 'active',
        instructor: ''
      });
    }
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter course title"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Instructor</label>
                    <Input
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      placeholder="Enter instructor name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter course description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price (₹)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 6 months"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Level</label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCourse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading courses...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.description?.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>₹{course.price.toLocaleString()}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/course/${course.id}`, '_blank')}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Courses:</span>
                <span className="font-semibold">{courses.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Courses:</span>
                <span className="font-semibold">
                  {courses.filter(c => c.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Draft Courses:</span>
                <span className="font-semibold">
                  {courses.filter(c => c.status === 'draft').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Course Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              Bulk Import Courses
            </Button>
            <Button className="w-full" variant="outline">
              Export Course Data
            </Button>
            <Button className="w-full" variant="outline">
              Generate Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-semibold">
                  ₹{courses.reduce((sum, course) => sum + course.price, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseManager;
