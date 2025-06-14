
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
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

  // Map course IDs to course names
  const courseNames = {
    '1': 'Mathematics Foundation',
    '2': 'Science Basics',
    '3': 'Mathematics Complete Course',
    '4': 'Advanced Chemistry',
    '5': 'Physics Master Class'
  };

  // Map course IDs to images
  const courseImages = {
    '1': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop',
    '2': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    '3': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop',
    '4': 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=300&h=200&fit=crop',
    '5': 'https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=300&h=200&fit=crop'
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
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {profile?.full_name || user?.email || 'Student'}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Continue your learning journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Video className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Live Classes</h3>
              <Link to="/live-class">
                <Button size="sm" className="w-full">Join Class</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">My Courses</h3>
              <Link to="/courses">
                <Button size="sm" variant="outline" className="w-full">View All</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Schedule</h3>
              <Link to="/timetable">
                <Button size="sm" variant="outline" className="w-full">View Schedule</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold mb-2">Achievements</h3>
              <Button size="sm" variant="outline" className="w-full">View All</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Purchased Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {purchasedCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-4">You haven't purchased any courses yet</p>
                    <Link to="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  purchasedCourses.map((purchase) => (
                    <div key={purchase.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={courseImages[purchase.course_id as keyof typeof courseImages] || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop'} 
                        alt={courseNames[purchase.course_id as keyof typeof courseNames] || 'Course'}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {courseNames[purchase.course_id as keyof typeof courseNames] || `Course ${purchase.course_id}`}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: '0%' }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">0%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Purchased: {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm">Continue</Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.length === 0 ? (
                  <div className="text-center py-4">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">No upcoming classes</p>
                  </div>
                ) : (
                  upcomingClasses.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{classItem.subject}</p>
                        <p className="text-xs text-muted-foreground">{classItem.time}</p>
                      </div>
                      <Badge variant={classItem.isLive ? "default" : "secondary"}>
                        {classItem.isLive ? "Live" : "Scheduled"}
                      </Badge>
                    </div>
                  ))
                )}
                {upcomingClasses.length > 0 && (
                  <Link to="/live-class">
                    <Button size="sm" className="w-full mt-3">
                      Join Live Class
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Classes Attended</span>
                  <span className="font-semibold">0/0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assignments Completed</span>
                  <span className="font-semibold">0/0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study Hours</span>
                  <span className="font-semibold">0h</span>
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
