
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, TrendingUp, Palette, Video, Users, Award, Globe, Star } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 12) {
        return 'Good morning';
      } else if (hour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    };

    setGreeting(getGreeting());
  }, []);

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
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {greeting},
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                {profile?.full_name || user?.email || 'User'}!
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
              Welcome to your personalized dashboard. Explore courses, track progress, and connect with fellow artists.
            </p>
          </div>

          {/* Stats Cards - Fixed readability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: BookOpen, title: 'Active Courses', value: '3', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/20' },
              { icon: Clock, title: 'Hours Learned', value: '24', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/20' },
              { icon: TrendingUp, title: 'Avg Progress', value: '78%', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/20' }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid - Fixed readability */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Palette,
                title: 'Learn from Industry Legends',
                description: 'Master artists who have shaped the creative world',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-500/20'
              },
              {
                icon: Video,
                title: 'Join Real-time Sessions',
                description: 'Direct feedback and personalized guidance',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-500/20'
              },
              {
                icon: Users,
                title: 'Connect with Passionate Artists',
                description: 'Build lifelong creative partnerships',
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-500/20'
              },
              {
                icon: Award,
                title: 'Earn Recognized Certificates',
                description: 'Open doors to professional opportunities',
                color: 'from-orange-500 to-orange-600',
                bgColor: 'bg-orange-500/20'
              },
              {
                icon: Globe,
                title: 'Access Premium Digital Tools',
                description: 'Premium creative software included',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-500/20'
              },
              {
                icon: Globe,
                title: 'Join a Worldwide Community',
                description: 'Expand your creative horizons globally',
                color: 'from-indigo-500 to-indigo-600',
                bgColor: 'bg-indigo-500/20'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-xl group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section - Fixed readability */}
          <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md border border-purple-500/40 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Join the Elite?</h2>
              <p className="text-white/90 mb-8 text-xl max-w-2xl mx-auto">
                Transform your passion into mastery with our world-class art education
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/courses')}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/40 text-white hover:bg-white/20 px-8 py-4 text-lg font-medium backdrop-blur-md"
                  onClick={() => navigate('/courses')}
                >
                  Explore Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
