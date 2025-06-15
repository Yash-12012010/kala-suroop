
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, Clock, Settings, Eye, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
}

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('beginner');

  // Fetch courses from database
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
      
      return data as Course[];
    }
  });

  // Check if we received a selected level from navigation
  useEffect(() => {
    if (location.state?.selectedLevel) {
      setActiveTab(location.state.selectedLevel);
    }
  }, [location.state]);

  // Group courses by level
  const coursesByLevel = {
    'beginner': courses.filter(course => course.level === 'beginner'),
    'intermediate': courses.filter(course => course.level === 'intermediate'),
    'advanced': courses.filter(course => course.level === 'advanced'),
    'specialized': courses.filter(course => course.level === 'specialized')
  };

  // Default image for courses
  const getDefaultImage = (level: string) => {
    const images = {
      'beginner': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
      'intermediate': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
      'advanced': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=250&fit=crop',
      'specialized': 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=250&fit=crop'
    };
    return images[level as keyof typeof images] || images.beginner;
  };

  const handleViewCourse = (course: Course) => {
    navigate(`/course/${course.id}`);
  };

  const handleEnrollClick = (course: Course) => {
    if (isAdmin) {
      navigate(`/course/${course.id}`, { 
        state: { 
          adminAccess: true,
          message: 'Admin access granted - you have full access to this course'
        }
      });
    } else {
      navigate('/checkout', { state: { course } });
    }
  };

  const handleAdminManage = (course: Course) => {
    navigate('/admin', { 
      state: { 
        selectedCourse: course,
        tab: 'courses'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            All Art Courses
            {isAdmin && (
              <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                Admin Access
              </Badge>
            )}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {isAdmin 
              ? "Administrator view - you have full access to all courses and management tools"
              : "Discover your artistic passion with our comprehensive collection of art courses"
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl h-auto p-1">
            <TabsTrigger 
              value="beginner" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300"
            >
              <span className="hidden sm:inline">Beginner</span>
              <span className="sm:hidden">Begin</span>
              <span className="ml-1">({coursesByLevel.beginner.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="intermediate" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300"
            >
              <span className="hidden sm:inline">Intermediate</span>
              <span className="sm:hidden">Inter</span>
              <span className="ml-1">({coursesByLevel.intermediate.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300"
            >
              <span className="hidden sm:inline">Advanced</span>
              <span className="sm:hidden">Adv</span>
              <span className="ml-1">({coursesByLevel.advanced.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="specialized" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300"
            >
              <span className="hidden sm:inline">Specialized</span>
              <span className="sm:hidden">Spec</span>
              <span className="ml-1">({coursesByLevel.specialized.length})</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(coursesByLevel).map(([tabKey, levelCourses]) => (
            <TabsContent key={tabKey} value={tabKey}>
              {levelCourses.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">📚</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                      No courses available for this level yet.
                    </p>
                    {isAdmin && (
                      <Button 
                        onClick={() => navigate('/admin', { state: { tab: 'courses' } })}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Add Courses
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {levelCourses.map((course) => (
                    <Card key={course.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2">
                      <div className="relative overflow-hidden">
                        <img 
                          src={getDefaultImage(course.level)} 
                          alt={course.title}
                          className="w-full h-36 sm:h-40 lg:h-48 object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {course.price > 0 && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 shadow-lg text-xs">
                            ₹{course.price}
                          </Badge>
                        )}
                        {course.featured && (
                          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg text-xs">
                            ⭐ Featured
                          </Badge>
                        )}
                        {isAdmin && (
                          <Badge className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-lg text-xs">
                            ADMIN
                          </Badge>
                        )}
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm sm:text-base lg:text-lg group-hover:text-pink-600 transition-colors duration-300 line-clamp-2 leading-tight">
                          {course.title}
                        </CardTitle>
                        
                        <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
                            4.8
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {Math.floor(Math.random() * 500) + 100}
                          </div>
                          {course.duration && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="truncate">{course.duration}</span>
                            </div>
                          )}
                        </div>
                        
                        {course.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        )}
                      </CardHeader>

                      <CardFooter className="flex flex-col gap-2 pt-0">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {isAdmin ? 'FREE' : course.price === 0 ? 'FREE' : `₹${course.price}`}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              by {course.instructor}
                            </span>
                          </div>
                          <Button 
                            onClick={() => handleViewCourse(course)}
                            size="sm"
                            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs px-3 py-1"
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </div>
                        
                        {isAdmin && (
                          <div className="flex gap-1 w-full">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewCourse(course)}
                              className="flex-1 border-blue-200 hover:bg-blue-50 text-xs py-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Access
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAdminManage(course)}
                              className="flex-1 border-purple-200 hover:bg-purple-50 text-xs py-1"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Manage
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;
