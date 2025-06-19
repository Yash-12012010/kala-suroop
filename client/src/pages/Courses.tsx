import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, Star, BookOpen, Search, Filter, ArrowRight, Play, Award, Sparkles } from 'lucide-react';
import { api, type Course as APICourse } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  instructor: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  enrolledStudents: number;
  featured: boolean;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCourses();
    
    // Set initial search query from URL params
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, levelFilter, priceFilter]);

  const fetchCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data.map(course => ({
        ...course,
        description: course.description || '',
        duration: course.duration || '',
        enrolledStudents: course.enrolledStudents || 0
      })));
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level.toLowerCase() === levelFilter);
    }

    // Price filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'free') {
        filtered = filtered.filter(course => course.price === 0);
      } else if (priceFilter === 'paid') {
        filtered = filtered.filter(course => course.price > 0);
      }
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = (courseId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/checkout?course=${courseId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-[#7FC29B] text-white';
      case 'intermediate': return 'bg-[#F19A3E] text-white';
      case 'advanced': return 'bg-[#726E75] text-white';
      default: return 'bg-[#B5EF8A] text-[#726E75]';
    }
  };

  const getPriceDisplay = (price: number) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#7FC29B] to-[#B5EF8A] relative overflow-hidden">
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-white text-lg font-semibold">Loading premium courses...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#7FC29B] to-[#B5EF8A] relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D7F171] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-[#B5EF8A] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/30">
              <BookOpen className="h-5 w-5 text-[#726E75]" />
              <span className="text-[#726E75] font-medium">Premium Learning</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
              <span className="text-white drop-shadow-lg">
                Master
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] bg-clip-text text-transparent drop-shadow-lg">
                Art Courses
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-md px-2 sm:px-0">
              Unlock your artistic potential with our world-class courses designed by industry experts
            </p>
          </div>

          {/* Premium Search and Filters - Mobile First */}
          <div className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-bottom px-2 sm:px-0">
            <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-xl lg:rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="relative md:col-span-2 lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/80 border-2 border-[#F19A3E]/50 text-[#726E75] placeholder-[#726E75]/70 focus:bg-white focus:border-[#F19A3E] transition-all duration-300 rounded-lg font-medium"
                    />
                  </div>

                  {/* Level Filter */}
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="bg-white/80 border-2 border-[#F19A3E]/50 text-[#726E75] focus:border-[#F19A3E] rounded-lg font-medium">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-[#F19A3E]/50 rounded-lg">
                      <SelectItem value="all" className="text-[#726E75] font-medium">All Levels</SelectItem>
                      <SelectItem value="beginner" className="text-[#726E75] font-medium">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="text-[#726E75] font-medium">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="text-[#726E75] font-medium">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Price Filter */}
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="bg-white/80 border-2 border-[#F19A3E]/50 text-[#726E75] focus:border-[#F19A3E] rounded-lg font-medium">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-[#F19A3E]/50 rounded-lg">
                      <SelectItem value="all" className="text-[#726E75] font-medium">All Prices</SelectItem>
                      <SelectItem value="free" className="text-[#726E75] font-medium">Free</SelectItem>
                      <SelectItem value="paid" className="text-[#726E75] font-medium">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Count */}
          <div className="mb-6 sm:mb-8 animate-slide-in-left px-2 sm:px-0">
            <p className="text-white/90 text-base sm:text-lg drop-shadow-md font-medium">
              Found <span className="text-white font-bold">{filteredCourses.length}</span> premium courses
            </p>
          </div>

          {/* Premium Courses Grid - Fully Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
            {filteredCourses.map((course, index) => (
              <Card 
                key={course.id} 
                className="bg-white/95 backdrop-blur-md border-2 border-white/40 shadow-2xl group hover:scale-[1.02] hover:shadow-3xl transition-all duration-500 animate-slide-in-bottom overflow-hidden rounded-xl lg:rounded-2xl card-enhanced"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Image - Mobile Optimized */}
                <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#7FC29B] via-[#B5EF8A] to-[#D7F171] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-white opacity-80 drop-shadow-lg" />
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
                    <Badge className={`${course.price === 0 ? 'bg-[#7FC29B]' : 'bg-[#F19A3E]'} text-white font-semibold px-2 sm:px-3 py-1 rounded-full shadow-lg text-xs sm:text-sm`}>
                      {getPriceDisplay(course.price)}
                    </Badge>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getLevelColor(course.level)} border-0 px-3 py-1 rounded-full font-medium shadow-md`}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center space-x-1 text-[#F19A3E]">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl text-[#726E75] font-bold leading-tight mb-2">
                    {course.title}
                  </CardTitle>
                  
                  <p className="text-[#726E75]/80 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-[#726E75]/70 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledStudents} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>Certificate</span>
                    </div>
                  </div>
                  
                  {/* Instructor */}
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-[#B5EF8A]/20 rounded-lg border border-[#7FC29B]/30">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {course.instructor.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#726E75] text-sm font-semibold">{course.instructor}</p>
                      <p className="text-[#726E75]/70 text-xs">Expert Instructor</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleEnroll(course.id)}
                      className="w-full bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A] hover:from-[#726E75] hover:to-[#7FC29B] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="w-full text-[#726E75] hover:text-white hover:bg-[#7FC29B]/20 transition-all duration-300"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredCourses.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl text-center py-16 animate-fade-in">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-[#7FC29B]/20 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-[#7FC29B]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#726E75]">No Courses Found</h3>
                  <p className="text-[#726E75]/70 max-w-md">
                    We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setLevelFilter('all');
                      setPriceFilter('all');
                    }}
                    className="bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A] hover:from-[#726E75] hover:to-[#7FC29B] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
