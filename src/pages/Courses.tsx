
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Users, Clock, Star, Play, Zap, Award, BookOpen, TrendingUp, Heart, Eye } from 'lucide-react';
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
  enrolled_students: number | null;
  created_at: string;
  updated_at: string;
}

interface Class {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(location.state?.selectedLevel || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching courses from database...');
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
      
      console.log('Courses fetched successfully:', data);
      return data as Course[];
    }
  });

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

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase();
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'students':
          return (b.enrolled_students || 0) - (a.enrolled_students || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const getDefaultImage = (level: string) => {
    const images = {
      'beginner': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
      'intermediate': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
      'advanced': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=250&fit=crop',
      'advance': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=250&fit=crop',
      'specialized': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop'
    };
    return images[level.toLowerCase() as keyof typeof images] || images.beginner;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'beginner': 'from-emerald-500 to-teal-500',
      'intermediate': 'from-blue-500 to-purple-500',
      'advanced': 'from-purple-500 to-pink-500',
      'advance': 'from-purple-500 to-pink-500',
      'specialized': 'from-orange-500 to-red-500'
    };
    return colors[level.toLowerCase() as keyof typeof colors] || colors.beginner;
  };

  const handleEnrollClick = (course: Course) => {
    const checkoutCourseData = {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      price: course.price,
      discountedPrice: course.price,
      originalPrice: course.price + 1000,
      students: course.enrolled_students || Math.floor(Math.random() * 500) + 100,
      rating: 4.8,
      image: getDefaultImage(course.level)
    };
    
    navigate('/checkout', { state: { course: checkoutCourseData } });
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-pink-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-xl text-purple-300 font-medium">Loading extraordinary courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex items-center justify-between">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 leading-tight">
              <span className="inline-block animate-fade-in">Explore</span>{' '}
              <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>Our</span>{' '}
              <span className="inline-block animate-fade-in" style={{ animationDelay: '0.4s' }}>Masterful</span>{' '}
              <span className="inline-block animate-fade-in" style={{ animationDelay: '0.6s' }}>Courses</span>
            </h1>
            <p className="text-lg sm:text-xl text-purple-200 max-w-3xl leading-relaxed">
              Unleash your creative potential with our world-class educational experiences. 
              <span className="text-pink-300 font-semibold"> Transform your passion into mastery.</span>
            </p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => navigate('/admin')} 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-purple-400/30"
            >
              <Award className="h-4 w-4 mr-2" />
              Manage Courses
            </Button>
          )}
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="mb-12 p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <div className="relative group">
                <Search className="absolute h-5 w-5 top-1/2 left-4 -translate-y-1/2 text-purple-300 group-hover:text-pink-300 transition-colors" />
                <Input
                  type="search"
                  placeholder="Search for your next masterpiece..."
                  className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-purple-200 focus:border-pink-400 focus:ring-pink-400 rounded-2xl h-14 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full bg-white/5 border-white/20 text-white rounded-2xl h-14 text-lg">
                  <Filter className="h-5 w-5 mr-2 text-purple-300" />
                  <SelectValue placeholder="Filter by Level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-400/30">
                  <SelectItem value="all" className="text-white hover:bg-purple-600/20">All Levels</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.name.toLowerCase()} className="text-white hover:bg-purple-600/20">
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-2xl h-12 min-w-[200px]">
                  <TrendingUp className="h-4 w-4 mr-2 text-purple-300" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-400/30">
                  <SelectItem value="newest" className="text-white hover:bg-purple-600/20">Latest Releases</SelectItem>
                  <SelectItem value="price-low" className="text-white hover:bg-purple-600/20">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-white hover:bg-purple-600/20">Price: High to Low</SelectItem>
                  <SelectItem value="students" className="text-white hover:bg-purple-600/20">Most Popular</SelectItem>
                  <SelectItem value="alphabetical" className="text-white hover:bg-purple-600/20">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Enhanced Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <Card 
              key={course.id} 
              className="group hover:shadow-2xl transition-all duration-700 cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-400/30 rounded-3xl overflow-hidden transform hover:scale-105 hover:-translate-y-4"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(course.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={getDefaultImage(course.level)} 
                  alt={course.title}
                  className="w-full h-56 object-cover group-hover:scale-125 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {course.featured && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-xl">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                
                <Badge className={`absolute top-4 right-4 bg-gradient-to-r ${getLevelColor(course.level)} text-white font-semibold shadow-xl border-0`}>
                  {course.level}
                </Badge>

                {hoveredCard === course.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-110 animate-pulse">
                      <Eye className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                  {course.title}
                </h3>
                
                <div className="flex items-center flex-wrap gap-4 text-sm text-purple-200">
                  <div className="flex items-center bg-white/5 rounded-full px-3 py-1">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    4.8
                  </div>
                  <div className="flex items-center bg-white/5 rounded-full px-3 py-1">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolled_students || 0}
                  </div>
                  {course.duration && (
                    <div className="flex items-center bg-white/5 rounded-full px-3 py-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  )}
                </div>
                
                {course.description && (
                  <p className="text-purple-100 text-sm line-clamp-3 leading-relaxed opacity-80">
                    {course.description?.substring(0, 120)}...
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {isAdmin ? 'FREE' : `₹${course.price}`}
                    </span>
                    <span className="text-xs text-purple-300">
                      by <span className="font-semibold text-pink-300">{course.instructor}</span>
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleCourseClick(course.id)}
                      size="sm"
                      variant="outline"
                      className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:text-white transition-all duration-300"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      onClick={() => handleEnrollClick(course)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Enroll
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
              <BookOpen className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-200 text-xl mb-2">No courses found matching your criteria.</p>
              <p className="text-purple-300 text-lg">Try adjusting your search or filters to discover amazing courses!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
