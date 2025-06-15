
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Download, Calendar, Users, Clock, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CourseFiles from '@/components/CourseFiles';
import CourseRecordings from '@/components/CourseRecordings';
import CourseLiveSessions from '@/components/CourseLiveSessions';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('live');

  // Mock course data - in real app, fetch from API
  const course = {
    id: courseId,
    title: courseId === '1' ? 'Drawing Fundamentals' : 
           courseId === '2' ? 'Color Theory Basics' :
           courseId === '3' ? 'Digital Painting Mastery' :
           courseId === '4' ? 'Portrait Painting Techniques' :
           courseId === '5' ? 'Abstract Expressionism' :
           courseId === '6' ? 'Professional Art Portfolio' :
           courseId === '7' ? 'Art Therapy & Healing' : 'Course',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
    originalPrice: 2499,
    discountedPrice: 1699,
    discount: 32,
    rating: 4.7,
    students: 892,
    duration: '80 hours',
    description: 'Learn the fundamental principles of drawing with our comprehensive course designed for beginners and intermediate artists.',
    level: courseId === '1' || courseId === '2' ? 'Beginner' :
           courseId === '3' || courseId === '4' ? 'Intermediate' :
           courseId === '5' || courseId === '6' ? 'Advanced' : 'Specialized'
  };

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
                    <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
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
                  {course.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students} students
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
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
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {isAdmin ? 'FREE' : `₹${course.discountedPrice}`}
                      </span>
                      {!isAdmin && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ₹{course.originalPrice}
                        </span>
                      )}
                    </div>
                    {!isAdmin && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                        {course.discount}% OFF
                      </Badge>
                    )}
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
