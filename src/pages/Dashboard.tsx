
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, FileText, Calendar, Trophy, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const enrolledCourses = [
    {
      id: 1,
      title: 'Mathematics Complete Course',
      class: 'Class 10',
      progress: 75,
      totalLessons: 40,
      completedLessons: 30,
      nextLesson: 'Quadratic Equations'
    },
    {
      id: 2,
      title: 'Physics Master Class',
      class: 'Class 11',
      progress: 45,
      totalLessons: 35,
      completedLessons: 16,
      nextLesson: 'Laws of Motion'
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      time: '09:00 AM',
      date: 'Today',
      teacher: 'Mr. Kumar'
    },
    {
      id: 2,
      subject: 'Physics',
      time: '11:00 AM',
      date: 'Tomorrow',
      teacher: 'Dr. Sharma'
    }
  ];

  const recentTests = [
    {
      id: 1,
      title: 'Mathematics Chapter 5 Test',
      score: 85,
      maxScore: 100,
      date: '2024-01-10'
    },
    {
      id: 2,
      title: 'Physics Mock Test 1',
      score: 78,
      maxScore: 100,
      date: '2024-01-08'
    }
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                  <p className="text-2xl font-bold">124</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Taken</p>
                  <p className="text-2xl font-bold">{recentTests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">82%</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge variant="secondary">{course.class}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {course.progress}% complete
                      </span>
                    </div>
                    
                    <Progress value={course.progress} className="mb-3" />
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                      <span>Next: {course.nextLesson}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex items-center">
                        <Play className="h-4 w-4 mr-1" />
                        Continue Learning
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Notes
                      </Button>
                    </div>
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
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.map((class_) => (
                  <div key={class_.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{class_.subject}</p>
                      <p className="text-sm text-muted-foreground">{class_.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{class_.time}</p>
                      <p className="text-xs text-muted-foreground">{class_.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Test Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Recent Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTests.map((test) => (
                  <div key={test.id} className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">{test.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-green-600">
                        {test.score}/{test.maxScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(test.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
