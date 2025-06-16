
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Trophy, 
  Calendar, 
  Video, 
  Star, 
  TrendingUp,
  Play,
  Award,
  Palette,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile } = useAuth();

  // Sample data - replace with real data from your backend
  const enrolledCourses = [
    { id: 1, title: "Digital Painting Mastery", progress: 75, instructor: "Sarah Chen", nextClass: "2024-06-17T10:00:00" },
    { id: 2, title: "Character Design Fundamentals", progress: 45, instructor: "Alex Rivera", nextClass: "2024-06-18T14:00:00" },
    { id: 3, title: "3D Modeling Essentials", progress: 30, instructor: "Maya Patel", nextClass: "2024-06-19T16:00:00" }
  ];

  const achievements = [
    { title: "First Course Completed", icon: Trophy, color: "text-yellow-400" },
    { title: "10 Hours Learned", icon: Clock, color: "text-blue-400" },
    { title: "Community Contributor", icon: Users, color: "text-green-400" },
    { title: "Perfect Attendance", icon: Star, color: "text-purple-400" }
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
          {/* Welcome Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <Palette className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">Artist Dashboard</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Welcome Back,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Artist'}
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
              Continue your creative journey and master new artistic skills
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="card-premium hover:scale-105 transition-all duration-300 animate-slide-in-bottom">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">3</div>
                <div className="text-purple-300 text-sm">Active Courses</div>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-300 animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">24</div>
                <div className="text-purple-300 text-sm">Hours Learned</div>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-300 animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">85%</div>
                <div className="text-purple-300 text-sm">Avg Progress</div>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-300 animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">4</div>
                <div className="text-purple-300 text-sm">Achievements</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Courses */}
            <div className="lg:col-span-2">
              <Card className="card-premium animate-slide-in-left">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
                    My Courses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <div 
                      key={course.id} 
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                          {course.title}
                        </h3>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {course.progress}%
                        </Badge>
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-purple-300">
                          <Users className="h-4 w-4 mr-1" />
                          {course.instructor}
                        </div>
                        <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white hover:bg-white/10">
                          <Play className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button asChild className="w-full btn-premium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Link to="/courses">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Explore More Courses
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Class */}
              <Card className="card-premium animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                    Next Live Class
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Digital Painting Mastery</h3>
                    <p className="text-purple-300 text-sm mb-1">with Sarah Chen</p>
                    <p className="text-purple-200 text-sm mb-4">Today at 10:00 AM</p>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl">
                      <Video className="h-4 w-4 mr-2" />
                      Join Live
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="card-premium animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-400" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                      <span className="text-purple-200 text-sm">{achievement.title}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-premium animate-slide-in-right" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="ghost" className="w-full justify-start text-purple-300 hover:text-white hover:bg-white/10">
                    <Link to="/announcements">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start text-purple-300 hover:text-white hover:bg-white/10">
                    <Link to="/store">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Art Store
                    </Link>
                  </Button>
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
