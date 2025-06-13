
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Award, 
  Clock, 
  Calendar,
  Play,
  Download,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const enrolledCourses = [
    {
      id: 'math-class-10',
      title: 'Advanced Mathematics',
      class: 'Class 10',
      progress: 75,
      totalLessons: 48,
      completedLessons: 36,
      nextLesson: 'Quadratic Equations - Part 3',
      instructor: 'Dr. Sharma',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop'
    },
    {
      id: 'physics-class-11',
      title: 'Physics Complete',
      class: 'Class 11',
      progress: 45,
      totalLessons: 52,
      completedLessons: 23,
      nextLesson: 'Laws of Motion - Newton\'s Second Law',
      instructor: 'Prof. Gupta',
      image: 'https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=400&h=200&fit=crop'
    }
  ];

  const upcomingClasses = [
    {
      subject: 'Mathematics',
      time: '10:00 AM',
      date: 'Today',
      teacher: 'Dr. Sharma',
      type: 'Live'
    },
    {
      subject: 'Physics',
      time: '2:00 PM',
      date: 'Tomorrow',
      teacher: 'Prof. Gupta',
      type: 'Live'
    },
    {
      subject: 'Chemistry',
      time: '11:00 AM',
      date: 'Jun 15',
      teacher: 'Ms. Patel',
      type: 'Recorded'
    }
  ];

  const achievements = [
    { title: 'First Course Completed', icon: Award, color: 'text-yellow-500' },
    { title: '7-Day Streak', icon: CheckCircle, color: 'text-green-500' },
    { title: 'Quiz Master', icon: BookOpen, color: 'text-blue-500' }
  ];

  const stats = [
    { title: 'Courses Enrolled', value: '2', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Hours Learned', value: '156', icon: Clock, color: 'bg-green-500' },
    { title: 'Certificates', value: '1', icon: Award, color: 'bg-yellow-500' },
    { title: 'Assignments', value: '12', icon: FileText, color: 'bg-purple-500' }
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>My Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                            <Badge variant="secondary" className="mt-1">
                              {course.class}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Next: {course.nextLesson}
                          </p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              Notes
                            </Button>
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingClasses.map((class_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{class_.subject}</p>
                        <p className="text-sm text-muted-foreground">{class_.teacher}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={class_.type === 'Live' ? 'destructive' : 'secondary'}>
                            {class_.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {class_.date} at {class_.time}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                      <span className="font-medium">{achievement.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="ghost">
                  <Download className="h-4 w-4 mr-2" />
                  Download Notes
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <FileText className="h-4 w-4 mr-2" />
                  Practice Tests
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Video className="h-4 w-4 mr-2" />
                  Recorded Sessions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
