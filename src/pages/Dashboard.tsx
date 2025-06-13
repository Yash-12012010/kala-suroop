
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

const Dashboard = () => {
  const { user } = useAuth();

  const enrolledCourses = [
    {
      id: 1,
      title: 'Mathematics Complete Course',
      progress: 75,
      nextClass: 'Today, 3:00 PM',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Physics Master Class',
      progress: 45,
      nextClass: 'Tomorrow, 10:00 AM',
      image: 'https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=300&h=200&fit=crop'
    }
  ];

  const upcomingClasses = [
    { subject: 'Mathematics', time: '3:00 PM', channel: 'math-algebra-001' },
    { subject: 'Physics', time: '4:30 PM', channel: 'physics-mechanics-001' },
    { subject: 'Chemistry', time: 'Tomorrow 10:00 AM', channel: 'chemistry-basics-001' }
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || 'Student'}!
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
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{course.progress}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Next class: {course.nextClass}
                      </p>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                ))}
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
                {upcomingClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{classItem.subject}</p>
                      <p className="text-sm text-muted-foreground">{classItem.time}</p>
                    </div>
                    <Badge>Live</Badge>
                  </div>
                ))}
                <Link to="/live-class">
                  <Button size="sm" className="w-full mt-3">
                    Join Live Class
                  </Button>
                </Link>
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
                  <span className="font-semibold">8/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assignments Completed</span>
                  <span className="font-semibold">5/6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study Hours</span>
                  <span className="font-semibold">24h</span>
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
