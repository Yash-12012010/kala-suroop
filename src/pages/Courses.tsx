import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, Star, BookOpen, Search, Filter, ArrowRight, Play, Award, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
  created_at: string;
  updated_at: string;
  status: string;
  enrolled_students: number;
  featured: boolean;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
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
  }, [courses, searchQuery, levelFilter, categoryFilter, priceFilter]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, price, duration, level, instructor, created_at, updated_at, status, enrolled_students, featured')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
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
      case 'beginner': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'intermediate': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'advanced': return 'bg-gradient-to-r from-red-500 to-pink-500';
      default: return 'bg-gradient-to-r from-purple-500 to-blue-500';
    }
  };

  const getPriceDisplay = (price: number) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>
        
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-white/80 text-lg">Loading premium courses...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
               backgroundSize: '50px 50px'
             }} />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">Premium Learning</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Master
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Art Courses
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed mb-8">
              Unlock your artistic potential with our world-class courses designed by industry experts
            </p>
          </div>

          {/* Premium Search and Filters */}
          <div className="mb-12 animate-slide-in-bottom">
            <Card className="card-premium bg-white/5 backdrop-blur-2xl border border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-purple-300/30 text-white placeholder-purple-300 focus:bg-white/20 transition-all duration-300"
                    />
                  </div>

                  {/* Level Filter */}
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="bg-white/10 border-purple-300/30 text-white">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/30">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-white/10 border-purple-300/30 text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/30">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="digital art">Digital Art</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="drawing">Drawing</SelectItem>
                      <SelectItem value="sculpture">Sculpture</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Price Filter */}
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="bg-white/10 border-purple-300/30 text-white">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/30">
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Count */}
          <div className="mb-8 animate-slide-in-left">
            <p className="text-purple-200/80 text-lg">
              Found <span className="text-white font-semibold">{filteredCourses.length}</span> premium courses
            </p>
          </div>

          {/* Premium Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <Card 
                key={course.id} 
                className="card-premium group hover:scale-[1.02] transition-all duration-500 animate-slide-in-bottom overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  {course.image_url ? (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <BookOpen className="h-16 w-16 text-white opacity-80" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${course.price === 0 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white font-semibold px-3 py-1 rounded-full shadow-lg`}>
                      {getPriceDisplay(course.price)}
                    </Badge>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getLevelColor(course.level)} text-white border-0 px-3 py-1 rounded-full font-medium`}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center space-x-1 text-purple-300">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                    {course.title}
                  </CardTitle>
                  
                  <p className="text-purple-200/80 text-sm leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-purple-300 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>1.2k students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>Certificate</span>
                    </div>
                  </div>
                  
                  {/* Instructor */}
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {course.instructor.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{course.instructor}</p>
                      <p className="text-purple-300 text-xs">Expert Instructor</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleEnroll(course.id)}
                      className="w-full btn-premium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="w-full text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300"
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
            <Card className="card-premium text-center py-16 animate-fade-in">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">No Courses Found</h3>
                  <p className="text-purple-300 max-w-md">
                    We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setLevelFilter('all');
                      setCategoryFilter('all');
                      setPriceFilter('all');
                    }}
                    className="btn-premium"
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
