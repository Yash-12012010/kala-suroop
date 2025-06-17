
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, TrendingUp, Video, Play, Users, Trophy, Star, Calendar, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const mockData = {
    activeCourses: 3,
    hoursLearned: 24,
    avgProgress: 78,
    achievements: 5
  };

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Advanced Watercolor Techniques',
      instructor: 'Sarah Chen',
      time: 'Today at 10:00 AM',
      duration: '2 hours',
      type: 'live'
    },
    {
      id: 2,
      subject: 'Digital Art Fundamentals',
      instructor: 'Alex Rivera',
      time: 'Tomorrow at 2:00 PM',
      duration: '1.5 hours',
      type: 'recorded'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'course_completed',
      title: 'Completed "Color Theory Basics"',
      time: '2 hours ago',
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      id: 2,
      type: 'live_session',
      title: 'Attended live session with Maya Patel',
      time: '1 day ago',
      icon: Video,
      color: 'text-red-500'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Earned "First Course Completed" badge',
      time: '2 days ago',
      icon: Star,
      color: 'text-purple-500'
    }
  ];

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
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">Artist Dashboard</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Welcome Back,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                {user?.email?.split('@')[0] || 'Artist'}
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-3xl leading-relaxed">
              Continue your creative journey and master new artistic skills
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{mockData.activeCourses}</p>
                    <p className="text-purple-300 text-sm">Active Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{mockData.hoursLearned}</p>
                    <p className="text-purple-300 text-sm">Hours Learned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{mockData.avgProgress}%</p>
                    <p className="text-purple-300 text-sm">Avg Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{mockData.achievements}</p>
                    <p className="text-purple-300 text-sm">Achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Courses */}
            <div className="lg:col-span-2">
              <Card className="card-premium animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-white flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Current Courses
                    </CardTitle>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {mockData.activeCourses} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['Complete Web Development Course from Scratch', 'Advanced JavaScript Fundamentals', 'React & Node.js Full Stack'].map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{course}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-purple-300">
                              <Clock className="h-4 w-4 mr-1" />
                              60 hours
                            </div>
                            <div className="flex items-center text-sm text-purple-300">
                              <Users className="h-4 w-4 mr-1" />
                              25 students
                            </div>
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                              Certificate
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{75 + index * 5}%</p>
                          <div className="w-24 h-2 bg-white/10 rounded-full mt-1">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                              style={{ width: `${75 + index * 5}%` }}
                            />
                          </div>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          <Play className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                      <Link to="/courses">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Explore More Courses
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Classes */}
              <Card className="card-premium animate-slide-in-bottom" style={{ animationDelay: '500ms' }}>
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Upcoming Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingClasses.map((classItem) => (
                    <div key={classItem.id} className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={classItem.type === 'live' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}>
                          {classItem.type === 'live' ? 'Live' : 'Recorded'}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-white mb-2">{classItem.subject}</h3>
                      <div className="space-y-1 text-sm text-purple-300">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          with {classItem.instructor}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {classItem.time}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className={`w-full mt-3 ${classItem.type === 'live' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        {classItem.type === 'live' ? 'Join Live' : 'Watch Recording'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-premium animate-slide-in-bottom" style={{ animationDelay: '600ms' }}>
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                        <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{activity.title}</p>
                          <p className="text-xs text-purple-300 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
