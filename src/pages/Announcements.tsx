
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Video, Pin } from 'lucide-react';
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
      case 'success': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'error': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'warning': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'info': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gray-500';
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
      <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">Loading announcements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 lg:mb-4">
            Kala Suroop Announcements
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
            Stay updated with the latest news from our art community
          </p>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {announcements.map((announcement) => {
            const isLiveClass = isLiveClassAnnouncement(announcement);
            return (
              <Card 
                key={announcement.id} 
                className={`hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-0 ${
                  isLiveClass ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                } ${announcement.is_pinned ? 'border-l-4 border-l-orange-500' : ''}`}
              >
                <CardHeader className="pb-3 lg:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                    <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white sm:pr-4 flex items-center">
                      {announcement.is_pinned && <Pin className="h-4 w-4 mr-2 text-orange-500" />}
                      {isLiveClass && <Video className="h-4 w-4 mr-2 text-red-500 animate-pulse" />}
                      {announcement.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getPriorityColor(announcement.type)} text-white w-fit text-xs border-0`}>
                        {announcement.type.toUpperCase()}
                      </Badge>
                      {isLiveClass && (
                        <Badge className="bg-red-500 text-white animate-pulse">
                          LIVE
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs lg:text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      {new Date(announcement.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      Kala Suroop Team
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {announcement.content}
                  </p>
                  
                  {isLiveClass && (
                    <Button 
                      onClick={() => joinLiveClass(announcement)}
                      className="bg-red-600 hover:bg-red-700 text-white animate-pulse"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Live Class Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {announcements.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No announcements at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
