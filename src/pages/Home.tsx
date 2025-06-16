import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock, ArrowRight } from 'lucide-react';
import DynamicContent from '@/components/DynamicContent';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

interface Class {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { getSetting } = useWebsiteSettings();

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

  // Fetch classes from database
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching classes:', error);
        throw error;
      }
      
      return data as Class[];
    }
  });

  // Get featured courses
  const featuredCourses = courses.filter(course => course.featured).slice(0, 6);

  // Create categories based on actual classes from admin panel
  const categories = classes.map(cls => {
    const coursesInClass = courses.filter(course => 
      course.level.toLowerCase() === cls.name.toLowerCase()
    ).length;
    
    return {
      name: cls.name,
      description: cls.description || `${cls.name} level courses`,
      courses: coursesInClass,
      color: getColorForLevel(cls.name.toLowerCase()),
      level: cls.name.toLowerCase()
    };
  });

  function getColorForLevel(level: string) {
    const colors = {
      'beginner': 'bg-gradient-to-br from-pink-500 to-rose-500',
      'intermediate': 'bg-gradient-to-br from-purple-500 to-indigo-500',
      'advanced': 'bg-gradient-to-br from-indigo-500 to-blue-500',
      'advance': 'bg-gradient-to-br from-indigo-500 to-blue-500',
      'specialized': 'bg-gradient-to-br from-blue-500 to-cyan-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  }

  const getDefaultImage = (level: string) => {
    const images = {
      'beginner': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
      'intermediate': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
      'advanced': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=250&fit=crop',
      'advance': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=250&fit=crop',
      'specialized': 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=250&fit=crop'
    };
    return images[level as keyof typeof images] || images.beginner;
  };

  const handleEnrollClick = (course: Course) => {
    // Map the course data to match what the checkout page expects
    const checkoutCourseData = {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      price: course.price,
      discountedPrice: course.price, // Using same price as discounted price
      originalPrice: course.price + 1000, // Adding some markup for original price display
      students: course.enrolled_students || Math.floor(Math.random() * 500) + 100,
      rating: 4.8, // Default rating
      image: getDefaultImage(course.level)
    };
    
    navigate('/checkout', { state: { course: checkoutCourseData } });
  };

  const handleCategoryClick = (level: string) => {
    navigate('/courses', { state: { selectedLevel: level } });
  };

  const siteTitle = getSetting('site_title', 'Kala Suroop');

  return (
    <div className="pt-16 min-h-screen">
      {/* Dynamic Hero Section */}
      <DynamicContent
        pageSlug="home"
        sectionKey="hero"
        renderAs="hero"
        fallback={
          <section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
                Welcome to {siteTitle}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
                Discover your artistic potential with our comprehensive art courses. From traditional painting to digital masterpieces, unleash your creativity with expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/courses">Explore Art Courses</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-2 border-pink-600 text-pink-600 hover:bg-pink-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/signup">Start Your Art Journey</Link>
                </Button>
              </div>
            </div>
          </section>
        }
      />

      {/* Course Categories - Only show if categories exist */}
      {categories.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-orange-950/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DynamicContent
              pageSlug="home"
              sectionKey="categories_header"
              renderAs="text"
              className="text-center mb-8 sm:mb-12"
              fallback={
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    Choose Your Art Level
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Select your skill level to access courses designed for your artistic journey
                  </p>
                </div>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {categories.map((category, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white/95 transform hover:scale-105 hover:-translate-y-2"
                  onClick={() => handleCategoryClick(category.level)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 ${category.color} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300`}>
                      <span className="text-white font-bold text-xl sm:text-2xl">🎨</span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold">{category.name}</CardTitle>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{category.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-center w-full">
                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {category.courses}
                        </span>
                        <p className="text-xs sm:text-sm text-muted-foreground">courses available</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-pink-600 transform group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DynamicContent
            pageSlug="home"
            sectionKey="featured_header"
            renderAs="text"
            className="text-center mb-8 sm:mb-12"
            fallback={
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Featured Art Courses
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Our most popular and highly-rated artistic masterclasses
                </p>
              </div>
            }
          />

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading featured courses...</p>
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">No featured courses available at the moment.</p>
              <Button asChild className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                <Link to="/courses">View All Courses</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredCourses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img 
                        src={getDefaultImage(course.level)} 
                        alt={course.title}
                        className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 shadow-lg">
                        Featured
                      </Badge>
                      <Badge variant="secondary" className="absolute top-3 right-3 bg-white/95 text-gray-800 capitalize shadow-lg">
                        {course.level}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                        {course.title}
                      </CardTitle>
                      
                      <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          4.8
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.enrolled_students || Math.floor(Math.random() * 500) + 100}
                        </div>
                        {course.duration && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                          </div>
                        )}
                      </div>
                      
                      {course.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardFooter className="flex flex-col gap-3 pt-0">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {course.price === 0 ? 'FREE' : `₹${course.price}`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            by {course.instructor}
                          </span>
                        </div>
                        <Button 
                          onClick={() => handleEnrollClick(course)}
                          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Enroll Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8 sm:mt-12">
                <Button size="lg" variant="outline" asChild className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/courses">View All Art Courses</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats Section with Dynamic Content */}
      <DynamicContent
        pageSlug="home"
        sectionKey="stats"
        renderAs="custom"
        className="py-12 sm:py-16 lg:py-20"
        fallback={
          <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
                <div className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    10K+
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">Creative Artists</div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    50+
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">Master Artists</div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {courses.length}+
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">Art Courses</div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    98%
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">Creative Success</div>
                </div>
              </div>
            </div>
          </section>
        }
      />
    </div>
  );
};

export default Home;
