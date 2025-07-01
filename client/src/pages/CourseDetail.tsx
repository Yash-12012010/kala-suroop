import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, BookOpen, GraduationCap, BadgeCheck, FileText, Video, Link as LinkIcon, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCourseAccess } from '@/hooks/useCourseAccess';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  status: string;
  instructor: string;
  featured: boolean;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
}

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasAccess, enrollment, loading: accessLoading } = useCourseAccess(courseId || '');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        console.error('Course ID is missing');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (error) {
          console.error('Error fetching course:', error);
        }

        if (data) {
          setCourse(data);
        } else {
          console.log('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect to checkout or handle enrollment logic here
    alert('Enrollment logic to be implemented');
  };

  if (!courseId) {
    return <div>Course ID is missing.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {loading ? (
        <div className="text-center py-20">Loading course details...</div>
      ) : course ? (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
            <div className="flex items-center space-x-4 mt-4">
              <span className="text-blue-500 font-semibold">₹{course.price}</span>
              <span className="text-gray-500">Duration: {course.duration}</span>
              <span className="text-gray-500">Level: {course.level}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Last Updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>Instructor: {course.instructor}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    <span>Status: {course.status}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Stats</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{course.enrolledStudents || 0} students enrolled</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{course.lessons || 0} lessons</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{course.assignments || 0} assignments</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Video className="h-4 w-4 mr-2" />
                  <span>{course.videos || 0} videos</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Enrollment</h2>
                {accessLoading ? (
                  <div>Checking access...</div>
                ) : hasAccess ? (
                  <div>
                    <p className="text-green-600 font-semibold mb-3">You have access to this course!</p>
                    <Button onClick={() => navigate('/dashboard')}>Go to Course Dashboard</Button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-3">Enroll now to gain access to this course.</p>
                    <Button onClick={handleEnroll}>Enroll Now</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">Course not found.</div>
      )}
    </div>
  );
}
