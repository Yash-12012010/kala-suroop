
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Video, Pin, ArrowRight, Clock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  target_audience: string;
  is_active: boolean;
  is_pinned: boolean;
  expires_at: string | null;
  created_at: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gte.' + new Date().toISOString())
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-emerald-500 to-green-500';
      case 'error': return 'bg-gradient-to-r from-red-500 to-rose-500';
      case 'warning': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'info': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-purple-500 to-pink-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <Star className="h-4 w-4" />;
      case 'error': return <Clock className="h-4 w-4" />;
      case 'warning': return <Clock className="h-4 w-4" />;
      case 'info': return <ArrowRight className="h-4 w-4" />;
      default: return <ArrowRight className="h-4 w-4" />;
    }
  };

  const isLiveClassAnnouncement = (announcement: Announcement) => {
    return announcement.title.includes('🔴 LIVE NOW') || announcement.title.includes('LIVE:');
  };

  const extractChannelFromContent = (content: string) => {
    const channelMatch = content.match(/Channel:\s*([^\s]+)/);
    return channelMatch ? channelMatch[1] : null;
  };

  const joinLiveClass = (announcement: Announcement) => {
    const channel = extractChannelFromContent(announcement.content);
    if (channel) {
      navigate(`/live-classroom?channel=${channel}&teacher=false`);
    } else {
      navigate('/live-classroom');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" />
        </div>
        
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-white/80 text-lg">Loading announcements...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <Bell className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">Latest Updates</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Academy
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Announcements
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
              Stay connected with the latest news, updates, and live sessions from our premium art community
            </p>
          </div>

          {/* Premium Announcements Grid */}
          <div className="space-y-6">
            {announcements.map((announcement, index) => {
              const isLiveClass = isLiveClassAnnouncement(announcement);
              return (
                <Card 
                  key={announcement.id} 
                  className={`card-premium hover:scale-[1.02] transition-all duration-500 animate-slide-in-bottom ${
                    isLiveClass ? 'ring-2 ring-red-500/50 shadow-red-500/20 shadow-2xl' : ''
                  } ${announcement.is_pinned ? 'ring-2 ring-orange-500/50 shadow-orange-500/20' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                      <CardTitle className="text-xl sm:text-2xl text-white sm:pr-4 flex items-center group">
                        {announcement.is_pinned && (
                          <div className="mr-3 p-1.5 bg-orange-500/20 rounded-lg">
                            <Pin className="h-4 w-4 text-orange-400" />
                          </div>
                        )}
                        {isLiveClass && (
                          <div className="mr-3 p-1.5 bg-red-500/20 rounded-lg animate-pulse">
                            <Video className="h-4 w-4 text-red-400" />
                          </div>
                        )}
                        <span className="group-hover:text-purple-300 transition-colors duration-300">
                          {announcement.title}
                        </span>
                      </CardTitle>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPriorityColor(announcement.type)} text-white border-0 px-3 py-1 rounded-full font-medium flex items-center space-x-1 shadow-lg`}>
                          {getTypeIcon(announcement.type)}
                          <span>{announcement.type.toUpperCase()}</span>
                        </Badge>
                        {isLiveClass && (
                          <Badge className="bg-red-500 text-white animate-pulse px-3 py-1 rounded-full font-bold shadow-lg">
                            🔴 LIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-purple-300/80 mt-3">
                      <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-1">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span>
                          {new Date(announcement.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-1">
                        <User className="h-4 w-4 text-purple-400" />
                        <span>Kala Suroop Team</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 mb-6">
                      <p className="text-base lg:text-lg text-purple-100 leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                    
                    {isLiveClass && (
                      <Button 
                        onClick={() => joinLiveClass(announcement)}
                        className="btn-premium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                      >
                        <Video className="h-5 w-5" />
                        <span>Join Live Class Now</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {announcements.length === 0 && (
              <Card className="card-premium text-center py-16">
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Bell className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">No Announcements</h3>
                    <p className="text-purple-300 max-w-md">
                      No announcements at the moment. Check back later for the latest updates from our academy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
