
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, Clock, Settings, Eye, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('beginner');

  // Check if we received a selected level from navigation
  useEffect(() => {
    if (location.state?.selectedLevel) {
      setActiveTab(location.state.selectedLevel);
    }
  }, [location.state]);

  const coursesByLevel = {
    'beginner': [
      {
        id: 1,
        title: 'Drawing Fundamentals',
        image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
        originalPrice: 2499,
        discountedPrice: 1699,
        discount: 32,
        rating: 4.7,
        students: 892,
        duration: '80 hours'
      },
      {
        id: 2,
        title: 'Color Theory Basics',
        image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=250&fit=crop',
        originalPrice: 2299,
        discountedPrice: 1599,
        discount: 30,
        rating: 4.6,
        students: 756,
        duration: '75 hours'
      }
    ],
    'intermediate': [
      {
        id: 3,
        title: 'Digital Painting Mastery',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
        originalPrice: 2999,
        discountedPrice: 1999,
        discount: 33,
        rating: 4.8,
        students: 1250,
        duration: '120 hours'
      },
      {
        id: 4,
        title: 'Portrait Painting Techniques',
        image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=400&h=250&fit=crop',
        originalPrice: 3199,
        discountedPrice: 2199,
        discount: 31,
        rating: 4.9,
        students: 1180,
        duration: '110 hours'
      }
    ],
    'advanced': [
      {
        id: 5,
        title: 'Abstract Expressionism',
        image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=250&fit=crop',
        originalPrice: 3499,
        discountedPrice: 2299,
        discount: 34,
        rating: 4.9,
        students: 890,
        duration: '100 hours'
      },
      {
        id: 6,
        title: 'Professional Art Portfolio',
        image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=250&fit=crop',
        originalPrice: 3299,
        discountedPrice: 2199,
        discount: 33,
        rating: 4.8,
        students: 745,
        duration: '95 hours'
      }
    ],
    'specialized': [
      {
        id: 7,
        title: 'Art Therapy & Healing',
        image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
        originalPrice: 1999,
        discountedPrice: 1299,
        discount: 35,
        rating: 4.7,
        students: 523,
        duration: '60 hours'
      }
    ]
  };

  const handleViewCourse = (course: any) => {
    navigate(`/course/${course.id}`);
  };

  const handleEnrollClick = (course: any) => {
    if (isAdmin) {
      // Admins get direct access without going through checkout
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

  const handleAdminManage = (course: any) => {
    navigate('/admin', { 
      state: { 
        selectedCourse: course,
        tab: 'classes'
      }
    });
  };

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            All Art Courses
            {isAdmin && (
              <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                Admin Access
              </Badge>
            )}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isAdmin 
              ? "Administrator view - you have full access to all courses and management tools"
              : "Discover your artistic passion with our comprehensive collection of art courses"
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="beginner" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">Advanced</TabsTrigger>
            <TabsTrigger value="specialized" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">Specialized</TabsTrigger>
          </TabsList>

          {Object.entries(coursesByLevel).map(([tabKey, courses]) => (
            <TabsContent key={tabKey} value={tabKey}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="relative">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0">
                        {course.discount}% OFF
                      </Badge>
                      {isAdmin && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                          ADMIN
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-pink-600 transition-colors">
                        {course.title}
                      </CardTitle>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          {course.rating}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                      </div>
                    </CardHeader>

                    <CardFooter className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {isAdmin ? 'FREE' : `₹${course.discountedPrice}`}
                          </span>
                          {!isAdmin && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{course.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleViewCourse(course)}
                          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          View Course
                        </Button>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex space-x-2 w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewCourse(course)}
                            className="flex-1 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Access
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAdminManage(course)}
                            className="flex-1 border-purple-200 hover:bg-purple-50"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;
