import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Download, Calendar, Users, Clock, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import CourseFiles from '@/components/CourseFiles';
import CourseRecordings from '@/components/CourseRecordings';
import CourseLiveSessions from '@/components/CourseLiveSessions';

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

  // Fetch course data from database
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
      
      return data as Course;
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
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading course...</p>
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
            <p className="text-lg text-gray-600 dark:text-gray-300">Course not found</p>
            <Button onClick={() => navigate('/courses')} className="mt-4">
              Back to Courses
            </Button>
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
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {course.title}
                    </h1>
                    <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white capitalize">
                      {course.level}
                    </Badge>
                  </div>
                  {isAdmin && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      ADMIN ACCESS
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
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
              <div className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={getDefaultImage(course.level)} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
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
                  <div className="mt-2 text-sm text-muted-foreground">
                    Instructor: {course.instructor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/70 backdrop-blur-sm">
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
      </div>
    </div>
  );
};

export default CourseDetail;
