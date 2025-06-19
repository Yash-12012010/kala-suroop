
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Clock, Users, Star, Sparkles, Megaphone, ArrowRight, BookOpen, Video, AlertTriangle, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const Announcements = () => {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-gradient-to-r from-red-500 to-red-600 border-red-400';
      case 'important': return 'bg-gradient-to-r from-[#F19A3E] to-[#D7F171] border-[#F19A3E]';
      case 'info': return 'bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A] border-[#7FC29B]';
      default: return 'bg-gradient-to-r from-[#F19A3E] to-[#D7F171] border-[#F19A3E]';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      case 'important': return <Star className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>
        
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-white/90 text-lg font-bold drop-shadow-lg">Loading announcements...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#B5EF8A] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-[#D7F171] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 25% 25%, #F19A3E 2px, transparent 2px),
                 radial-gradient(circle at 75% 75%, #7FC29B 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px, 40px 40px'
             }} />
      </div>

      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#F19A3E]/30 to-[#D7F171]/30 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border-3 border-white/40 shadow-2xl">
              <Megaphone className="h-6 w-6 text-[#D7F171] animate-pulse" />
              <span className="text-white font-black text-xl drop-shadow-lg">ACADEMY UPDATES</span>
              <Sparkles className="h-6 w-6 text-[#F19A3E] animate-pulse" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent drop-shadow-2xl">
                Latest
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F19A3E] via-[#D7F171] to-[#7FC29B] bg-clip-text text-transparent drop-shadow-2xl">
                Announcements
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-lg">
              Stay updated with the latest news, events, and important information from Kala Suroop Academy
            </p>
          </div>

          {/* Announcements Grid or Empty State */}
          {announcements.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {announcements.map((announcement, index) => (
                <Card 
                  key={announcement.id} 
                  className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl border-4 border-[#F19A3E]/40 hover:border-[#F19A3E] shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 rounded-3xl overflow-hidden animate-slide-in-bottom"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={`${getTypeColor(announcement.type)} text-white font-black px-4 py-2 text-sm border-2 shadow-lg flex items-center space-x-2`}>
                        {getTypeIcon(announcement.type)}
                        <span>{announcement.type?.toUpperCase() || 'INFO'}</span>
                      </Badge>
                      <div className="text-right">
                        <div className="flex items-center text-white/80 text-sm font-bold mb-1">
                          <Calendar className="h-4 w-4 mr-2 text-[#D7F171]" />
                          {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center text-white/70 text-xs font-medium">
                          <Clock className="h-3 w-3 mr-1 text-[#B5EF8A]" />
                          {format(new Date(announcement.created_at), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-white mb-4 drop-shadow-lg leading-tight">
                      {announcement.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-white/90 leading-relaxed mb-6 font-bold text-lg drop-shadow-sm">
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#B5EF8A] text-sm font-bold">
                        <Users className="h-4 w-4 mr-2" />
                        Academy Wide
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#D7F171] hover:text-white hover:bg-[#F19A3E]/30 font-bold transition-all duration-300 border-2 border-transparent hover:border-[#F19A3E]/60 rounded-xl"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-2xl border-4 border-[#F19A3E]/40 text-center py-20 animate-fade-in shadow-2xl rounded-3xl">
              <CardContent>
                <div className="flex flex-col items-center space-y-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#F19A3E] to-[#D7F171] rounded-full flex items-center justify-center animate-pulse shadow-2xl border-4 border-white/50">
                    <Bell className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white drop-shadow-lg">
                      No Announcements Yet
                    </h2>
                    <p className="text-xl text-white/90 max-w-md mx-auto font-bold drop-shadow-sm leading-relaxed">
                      Stay tuned! Important updates and exciting news from the academy will appear here.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[#D7F171] font-bold text-lg">
                    <Sparkles className="h-5 w-5" />
                    <span>Check back soon for updates</span>
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-3 border-white/40">
                      <BookOpen className="h-5 w-5 mr-3" />
                      Explore Courses
                    </Button>
                    <Button variant="outline" className="bg-white/10 backdrop-blur-md border-3 border-white/40 text-white hover:bg-white/20 px-8 py-4 rounded-2xl transition-all duration-300 font-black">
                      <Video className="h-5 w-5 mr-3" />
                      Join Live Classes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
