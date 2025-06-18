
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
    <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
      {/* Premium Background Effects with new color palette */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-[#B5EF8A] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-[#D7F171] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#F19A3E]/5 to-transparent" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(241,154,62,0.1) 1px, transparent 0)',
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
              <span className="bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent">
                {greeting},
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F19A3E] via-[#D7F171] to-[#7FC29B] bg-clip-text text-transparent">
                {profile?.full_name || user?.email || 'User'}!
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Welcome to your personalized dashboard. Explore courses, track progress, and connect with fellow artists.
            </p>
          </div>

          {/* Stats Cards - Enhanced readability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: BookOpen, title: 'Active Courses', value: '3', color: 'from-[#F19A3E] to-[#D7F171]', bgColor: 'bg-[#F19A3E]/20' },
              { icon: Clock, title: 'Hours Learned', value: '24', color: 'from-[#7FC29B] to-[#B5EF8A]', bgColor: 'bg-[#7FC29B]/20' },
              { icon: TrendingUp, title: 'Avg Progress', value: '78%', color: 'from-[#B5EF8A] to-[#D7F171]', bgColor: 'bg-[#B5EF8A]/20' }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 transition-all duration-300 shadow-xl hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} border border-[#F19A3E]/20`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid - Enhanced readability */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Palette,
                title: 'Learn from Industry Legends',
                description: 'Master artists who have shaped the creative world',
                color: 'from-[#F19A3E] to-[#D7F171]',
                bgColor: 'bg-[#F19A3E]/20'
              },
              {
                icon: Video,
                title: 'Join Real-time Sessions',
                description: 'Direct feedback and personalized guidance',
                color: 'from-[#7FC29B] to-[#B5EF8A]',
                bgColor: 'bg-[#7FC29B]/20'
              },
              {
                icon: Users,
                title: 'Connect with Passionate Artists',
                description: 'Build lifelong creative partnerships',
                color: 'from-[#B5EF8A] to-[#D7F171]',
                bgColor: 'bg-[#B5EF8A]/20'
              },
              {
                icon: Award,
                title: 'Earn Recognized Certificates',
                description: 'Open doors to professional opportunities',
                color: 'from-[#F19A3E] to-[#7FC29B]',
                bgColor: 'bg-[#F19A3E]/20'
              },
              {
                icon: Globe,
                title: 'Access Premium Digital Tools',
                description: 'Premium creative software included',
                color: 'from-[#D7F171] to-[#7FC29B]',
                bgColor: 'bg-[#D7F171]/20'
              },
              {
                icon: Globe,
                title: 'Join a Worldwide Community',
                description: 'Expand your creative horizons globally',
                color: 'from-[#726E75] to-[#F19A3E]',
                bgColor: 'bg-[#726E75]/20'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 transition-all duration-300 shadow-xl group hover:shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.bgColor} border border-[#F19A3E]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/90 leading-relaxed font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section - Enhanced readability */}
          <Card className="bg-gradient-to-r from-[#F19A3E]/30 to-[#7FC29B]/30 backdrop-blur-md border border-[#F19A3E]/40 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Join the Elite?</h2>
              <p className="text-white/95 mb-8 text-xl max-w-2xl mx-auto font-medium">
                Transform your passion into mastery with our world-class art education
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white px-8 py-4 text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
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
