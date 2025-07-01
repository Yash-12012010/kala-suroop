
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
      {/* Revolutionary Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#F19A3E] to-[#D7F171] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#7FC29B] to-[#B5EF8A] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-[#B5EF8A] to-[#F19A3E] rounded-full mix-blend-screen filter blur-2xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-br from-[#D7F171] to-[#7FC29B] rounded-full mix-blend-screen filter blur-2xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#F19A3E]/5 via-transparent to-[#7FC29B]/5" />
        
        <div className="absolute inset-0 opacity-5" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 20% 20%, #F19A3E 1px, transparent 1px),
                 radial-gradient(circle at 80% 80%, #7FC29B 0.5px, transparent 0.5px),
                 linear-gradient(0deg, transparent 24%, rgba(241, 154, 62, 0.05) 25%, rgba(241, 154, 62, 0.05) 26%, transparent 27%)
               `,
               backgroundSize: '100px 100px, 60px 60px, 50px 50px'
             }} />
        
        <div className="absolute inset-0 shimmer opacity-20" />
      </div>

      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent drop-shadow-2xl text-shadow-lg">
                {greeting},
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F19A3E] via-[#D7F171] to-[#7FC29B] bg-clip-text text-transparent drop-shadow-2xl text-shadow-lg">
                {profile?.full_name || user?.email || 'User'}!
              </span>
            </h1>
            
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-xl text-shadow-lg">
              Welcome to your personalized dashboard. Explore courses, track progress, and connect with fellow artists.
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: BookOpen, title: 'Active Courses', value: '3', bgGradient: 'from-[#F19A3E] to-[#D7F171]', borderColor: 'border-[#F19A3E]' },
              { icon: Clock, title: 'Hours Learned', value: '24', bgGradient: 'from-[#7FC29B] to-[#B5EF8A]', borderColor: 'border-[#7FC29B]' },
              { icon: TrendingUp, title: 'Avg Progress', value: '78%', bgGradient: 'from-[#B5EF8A] to-[#D7F171]', borderColor: 'border-[#B5EF8A]' }
            ].map((stat, index) => (
              <Card key={index} className={`bg-white/98 backdrop-blur-2xl hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-3xl border-3 ${stat.borderColor} hover:scale-105 transform rounded-2xl`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 font-black text-sm mb-2 drop-shadow-sm">{stat.title}</p>
                      <p className="text-4xl font-black text-gray-900 drop-shadow-sm">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgGradient} shadow-xl border-2 border-white/50`}>
                      <stat.icon className="h-7 w-7 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Palette,
                title: 'Learn from Industry Legends',
                description: 'Master artists who have shaped the creative world',
                bgGradient: 'from-[#F19A3E] to-[#D7F171]',
                borderColor: 'border-[#F19A3E]'
              },
              {
                icon: Video,
                title: 'Join Real-time Sessions',
                description: 'Direct feedback and personalized guidance',
                bgGradient: 'from-[#7FC29B] to-[#B5EF8A]',
                borderColor: 'border-[#7FC29B]'
              },
              {
                icon: Users,
                title: 'Connect with Passionate Artists',
                description: 'Build lifelong creative partnerships',
                bgGradient: 'from-[#B5EF8A] to-[#D7F171]',
                borderColor: 'border-[#B5EF8A]'
              },
              {
                icon: Award,
                title: 'Earn Recognized Certificates',
                description: 'Open doors to professional opportunities',
                bgGradient: 'from-[#D7F171] to-[#F19A3E]',
                borderColor: 'border-[#D7F171]'
              },
              {
                icon: Globe,
                title: 'Access Premium Digital Tools',
                description: 'Premium creative software included',
                bgGradient: 'from-[#726E75] to-[#7FC29B]',
                borderColor: 'border-[#726E75]'
              },
              {
                icon: Globe,
                title: 'Join a Worldwide Community',
                description: 'Expand your creative horizons globally',
                bgGradient: 'from-[#F19A3E] to-[#726E75]',
                borderColor: 'border-[#F19A3E]'
              }
            ].map((feature, index) => (
              <Card key={index} className={`bg-white/98 backdrop-blur-2xl hover:bg-white transition-all duration-300 shadow-2xl group hover:shadow-3xl border-3 ${feature.borderColor} hover:scale-105 transform cursor-pointer rounded-2xl`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.bgGradient} border-3 border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <feature.icon className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 drop-shadow-sm">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed font-bold drop-shadow-sm text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <Card className="bg-white/98 backdrop-blur-2xl border-4 border-[#F19A3E] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] transform rounded-2xl hover:bg-white">
            <CardContent className="p-16 text-center relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F19A3E]/10 via-[#D7F171]/10 to-[#7FC29B]/10 rounded-lg" />
              
              <div className="relative z-10">
                <h2 className="text-5xl font-black text-gray-900 mb-6 drop-shadow-sm">Ready to Join the Elite?</h2>
                <p className="text-gray-700 text-2xl mb-10 max-w-3xl mx-auto font-bold drop-shadow-sm leading-relaxed">
                  Transform your passion into mastery with our world-class art education
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white px-12 py-6 text-xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-3 border-white/30"
                    onClick={() => navigate('/courses')}
                  >
                    <Star className="h-6 w-6 mr-3" />
                    Start Your Journey
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-4 border-[#7FC29B] text-gray-900 hover:bg-[#7FC29B]/30 px-12 py-6 text-xl font-black backdrop-blur-md bg-white/90 shadow-2xl transform hover:scale-110 transition-all duration-300"
                    onClick={() => navigate('/courses')}
                  >
                    Explore Courses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
