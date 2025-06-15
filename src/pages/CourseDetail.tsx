import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Download, Calendar, Users, Clock, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import CourseFiles from '@/components/CourseFiles';
import CourseRecordings from '@/components/CourseRecordings';
import CourseLiveSessions from '@/components/CourseLiveSessions';
import CourseAccessGuard from '@/components/CourseAccessGuard';

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string;
  level: string;
  duration: string | null;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  enrolled_students: number | null;
  featured: boolean;
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    console.log('CourseDetail mounted with courseId:', courseId);
  }, [courseId]);

  // Fetch course data from database
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) {
        console.error('No courseId provided');
        return null;
      }
      
      console.log('Fetching course with ID:', courseId);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
      
      console.log('Course data fetched:', data);
      return data as Course | null;
    },
    enabled: !!courseId
  });

  // Default image for courses
  const getDefaultImage = (level: string) => {
    const images = {
      'beginner': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
      'intermediate': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
      'advanced': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=250&fit=crop',
      'specialized': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop'
    };
    return images[level as keyof typeof images] || images.beginner;
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading course...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Course ID: {courseId}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Course fetch error:', error);
    return (
      <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Database Connection Error</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Failed to connect to the database or retrieve course data.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                Course ID: {courseId}
              </p>
              <p className="text-xs text-red-500 mb-6 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
                Error: {error?.message || 'Unknown error'}
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/courses')} className="w-full">
                  Back to Courses
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Course Not Found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The course you're looking for doesn't exist in the database.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                Requested Course ID: {courseId}
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/courses')} className="w-full">
                  Browse All Courses
                </Button>
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin')}
                    className="w-full"
                  >
                    Create New Course
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/courses')}
            className="mb-6 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {course.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white capitalize">
                        {course.level}
                      </Badge>
                      {course.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      ADMIN ACCESS
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {course.description || 'No description available for this course.'}
                </p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolled_students || 0} students
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration || '40-80 hours'}
                  </div>
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-1" />
                    Live Sessions Available
                  </div>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20">
                <img 
                  src={getDefaultImage(course.level)} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {isAdmin ? 'FREE' : `₹${course.price}`}
                      </span>
                    </div>
                    {!isAdmin && course.price > 0 && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                        Available
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Instructor: {course.instructor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content with Access Guard */}
        <CourseAccessGuard 
          courseId={courseId || ''} 
          courseName={course.title}
          coursePrice={course.price}
        >
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/70 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="live" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Live Sessions
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                Course Files
              </TabsTrigger>
              <TabsTrigger value="recordings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                Recordings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live">
              <CourseLiveSessions courseId={courseId || ''} />
            </TabsContent>

            <TabsContent value="files">
              <CourseFiles courseId={courseId || ''} />
            </TabsContent>

            <TabsContent value="recordings">
              <CourseRecordings courseId={courseId || ''} />
            </TabsContent>
          </Tabs>
        </CourseAccessGuard>
      </div>
    </div>
  );
};

export default CourseDetail;
