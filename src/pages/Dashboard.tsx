import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Video, 
  Calendar, 
  Award, 
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define types for the new tables
interface CoursePurchase {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LiveSession {
  id: string;
  course_id: string;
  title: string;
  scheduled_start: string;
  scheduled_end: string;
  agora_channel: string | null;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, profile, loading } = useAuth();

  // Fetch purchased courses
  const { data: purchasedCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['purchased-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('course_purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'paid');
      
      if (error) throw error;
      return data as CoursePurchase[];
    },
    enabled: !!user?.id
  });

  // Fetch live sessions for purchased courses
  const { data: liveSessions = [] } = useQuery({
    queryKey: ['live-sessions', purchasedCourses],
    queryFn: async () => {
      if (purchasedCourses.length === 0) return [];
      
      const courseIds = purchasedCourses.map(course => course.course_id);
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .in('course_id', courseIds)
        .gte('scheduled_start', new Date().toISOString())
        .order('scheduled_start', { ascending: true });
      
      if (error) throw error;
      return data as LiveSession[];
    },
    enabled: purchasedCourses.length > 0
  });

  // Map course IDs to art course names
  const courseNames = {
    '1': 'Drawing Fundamentals',
    '2': 'Color Theory Basics',
    '3': 'Digital Painting Mastery',
    '4': 'Portrait Painting Techniques',
    '5': 'Abstract Expressionism'
  };

  // Map course IDs to art-themed images
  const courseImages = {
    '1': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
    '2': 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=200&fit=crop',
    '3': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop',
    '4': 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=300&h=200&fit=crop',
    '5': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=300&h=200&fit=crop'
  };

  if (loading || coursesLoading) {
    return (
      <div className="pt-20 pb-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Get upcoming classes for purchased courses
  const upcomingClasses = liveSessions.slice(0, 3).map(session => {
    const isLive = new Date(session.scheduled_start) <= new Date() && 
                   new Date(session.scheduled_end) > new Date();
    const startTime = new Date(session.scheduled_start);
    const timeString = startTime < new Date(Date.now() + 24 * 60 * 60 * 1000) 
      ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : startTime.toLocaleDateString() + ' ' + startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return {
      subject: session.title,
      time: isLive ? 'Live Now' : timeString,
      channel: session.agora_channel,
      isLive
    };
  });

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 lg:mb-4">
            Welcome back to Kala Suroop, {profile?.full_name || user?.email || 'Artist'}!
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
            Continue your artistic journey and create beautiful masterpieces
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6 text-center">
              <Video className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 text-pink-600" />
              <h3 className="font-semibold text-sm lg:text-base mb-2">Live Classes</h3>
              <Link to="/live-class">
                <Button size="sm" className="w-full text-xs lg:text-sm bg-gradient-to-r from-pink-600 to-purple-600">Join Class</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6 text-center">
              <Palette className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 text-orange-600" />
              <h3 className="font-semibold text-sm lg:text-base mb-2">My Courses</h3>
              <Link to="/courses">
                <Button size="sm" variant="outline" className="w-full text-xs lg:text-sm border-orange-600 text-orange-600 hover:bg-orange-50">View All</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6 text-center">
              <Calendar className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 text-purple-600" />
              <h3 className="font-semibold text-sm lg:text-base mb-2">Schedule</h3>
              <Link to="/timetable">
                <Button size="sm" variant="outline" className="w-full text-xs lg:text-sm border-purple-600 text-purple-600 hover:bg-purple-50">View Schedule</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6 text-center">
              <Award className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 text-indigo-600" />
              <h3 className="font-semibold text-sm lg:text-base mb-2">Achievements</h3>
              <Button size="sm" variant="outline" className="w-full text-xs lg:text-sm border-indigo-600 text-indigo-600 hover:bg-indigo-50">View All</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Purchased Courses */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center text-lg lg:text-xl">
                  <Palette className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-pink-600" />
                  My Art Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {purchasedCourses.length === 0 ? (
                  <div className="text-center py-6 lg:py-8">
                    <Palette className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 lg:mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-3 lg:mb-4 text-sm lg:text-base">You haven't enrolled in any art courses yet</p>
                    <Link to="/courses">
                      <Button className="text-sm lg:text-base bg-gradient-to-r from-pink-600 to-purple-600">Browse Art Courses</Button>
                    </Link>
                  </div>
                ) : (
                  purchasedCourses.map((purchase) => (
                    <div key={purchase.id} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 lg:p-4 border rounded-lg">
                      <img 
                        src={courseImages[purchase.course_id as keyof typeof courseImages] || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop'} 
                        alt={courseNames[purchase.course_id as keyof typeof courseNames] || 'Course'}
                        className="w-full sm:w-14 lg:w-16 h-32 sm:h-14 lg:h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm lg:text-base truncate">
                          {courseNames[purchase.course_id as keyof typeof courseNames] || `Course ${purchase.course_id}`}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1 lg:mt-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 lg:h-2">
                            <div 
                              className="bg-green-600 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                              style={{ width: '0%' }}
                            />
                          </div>
                          <span className="text-xs lg:text-sm text-muted-foreground">0%</span>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                          Purchased: {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" className="w-full sm:w-auto text-xs lg:text-sm">Continue</Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Upcoming Classes */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
                  Upcoming Art Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 lg:space-y-3">
                {upcomingClasses.length === 0 ? (
                  <div className="text-center py-3 lg:py-4">
                    <Clock className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs lg:text-sm text-gray-500">No upcoming art classes</p>
                  </div>
                ) : (
                  upcomingClasses.map((classItem, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-2 lg:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs lg:text-sm truncate">{classItem.subject}</p>
                        <p className="text-xs text-muted-foreground">{classItem.time}</p>
                      </div>
                      <Badge variant={classItem.isLive ? "default" : "secondary"} className="text-xs w-fit">
                        {classItem.isLive ? "Live" : "Scheduled"}
                      </Badge>
                    </div>
                  ))
                )}
                {upcomingClasses.length > 0 && (
                  <Link to="/live-class">
                    <Button size="sm" className="w-full mt-2 lg:mt-3 text-xs lg:text-sm bg-gradient-to-r from-pink-600 to-purple-600">
                      Join Art Class
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-purple-600" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs lg:text-sm">Art Classes Attended</span>
                  <span className="font-semibold text-sm lg:text-base">0/0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs lg:text-sm">Projects Completed</span>
                  <span className="font-semibold text-sm lg:text-base">0/0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs lg:text-sm">Creative Hours</span>
                  <span className="font-semibold text-sm lg:text-base">0h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
