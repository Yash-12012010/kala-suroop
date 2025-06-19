
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Play, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LiveSession {
  id: string;
  title: string;
  scheduled_start: string;
  scheduled_end: string;
  agora_channel: string | null;
  course_id: string;
}

interface CourseLiveSessionsProps {
  courseId: string;
}

const CourseLiveSessions: React.FC<CourseLiveSessionsProps> = ({ courseId }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('course_id', courseId)
        .order('scheduled_start', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load live sessions",
          variant: "destructive"
        });
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (session: LiveSession) => {
    if (!session.agora_channel) {
      toast({
        title: "Session Not Active",
        description: "This session is not currently live",
        variant: "destructive"
      });
      return;
    }

    navigate('/live-classroom', {
      state: {
        course: {
          id: courseId,
          title: session.title
        },
        sessionId: session.id,
        channelName: session.agora_channel,
        adminAccess: isAdmin
      }
    });
  };

  const handleManageSession = (session: LiveSession) => {
    navigate('/admin', {
      state: {
        selectedSession: session,
        tab: 'live-classes'
      }
    });
  };

  const getSessionStatus = (session: LiveSession) => {
    const now = new Date();
    const start = new Date(session.scheduled_start);
    const end = new Date(session.scheduled_end);

    if (session.agora_channel && now >= start && now <= end) {
      return { status: 'live', label: 'LIVE', color: 'bg-red-500' };
    } else if (now < start) {
      return { status: 'upcoming', label: 'UPCOMING', color: 'bg-blue-500' };
    } else {
      return { status: 'ended', label: 'ENDED', color: 'bg-gray-500' };
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate('/admin', { state: { tab: 'live-classes' } })}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </div>
      )}

      {sessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Live Sessions</h3>
            <p className="text-gray-600">
              {isAdmin 
                ? "Create your first live session to get started" 
                : "No live sessions have been scheduled for this course yet"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const sessionStatus = getSessionStatus(session);
            
            return (
              <Card key={session.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <Badge className={`${sessionStatus.color} text-white text-xs`}>
                      {sessionStatus.label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(session.scheduled_start).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(session.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(session.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {sessionStatus.status === 'live' && (
                      <Button 
                        onClick={() => handleJoinSession(session)}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Join Live Session
                      </Button>
                    )}

                    {sessionStatus.status === 'upcoming' && (
                      <Button 
                        variant="outline" 
                        disabled
                        className="w-full"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Starts {new Date(session.scheduled_start).toLocaleDateString()}
                      </Button>
                    )}

                    {sessionStatus.status === 'ended' && (
                      <Button 
                        variant="outline" 
                        disabled
                        className="w-full"
                      >
                        Session Ended
                      </Button>
                    )}

                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManageSession(session)}
                        className="w-full border-purple-200 hover:bg-purple-50"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Session
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseLiveSessions;
