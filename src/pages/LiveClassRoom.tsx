import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Users, Clock, AlertCircle } from 'lucide-react';
import LiveClass from '@/components/LiveClass';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LiveSession {
  id: string;
  title: string;
  agora_channel: string | null;
  scheduled_start: string;
  scheduled_end: string;
}

const LiveClassRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessionId } = useParams();
  const { user } = useAuth();
  
  const [showLiveClass, setShowLiveClass] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Using the provided Agora App ID
  const AGORA_APP_ID = '76fe48407b1d4e0986592d7ad3d5a361';

  // Check URL parameters for auto-join - this should run immediately
  useEffect(() => {
    console.log('=== LiveClassRoom Auto-Join Check ===');
    console.log('Current path:', location.pathname);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Session ID from params:', sessionId);
    
    const channelFromUrl = searchParams.get('channel');
    const teacherFromUrl = searchParams.get('teacher') === 'true';
    
    console.log('Channel from URL:', channelFromUrl);
    console.log('Teacher from URL:', teacherFromUrl);
    
    // If we have channel from URL, auto-join immediately
    if (channelFromUrl && channelFromUrl.trim()) {
      console.log('AUTO-JOINING: Setting up live class immediately');
      setChannelName(channelFromUrl.trim());
      setIsTeacher(teacherFromUrl);
      setShowLiveClass(true);
      return;
    }

    // Otherwise, check if we have a sessionId to load
    if (sessionId) {
      console.log('Loading session by ID:', sessionId);
      loadSessionById(sessionId);
    }
  }, [searchParams, sessionId, location.pathname]);

  const loadSessionById = async (id: string) => {
    try {
      console.log('Fetching session with ID:', id);
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading session:', error);
        return;
      }

      console.log('Session data loaded:', data);
      if (data && data.agora_channel) {
        console.log('Setting up live class with channel:', data.agora_channel);
        setChannelName(data.agora_channel);
        setIsTeacher(false);
        setShowLiveClass(true);
      } else {
        console.log('No agora channel found for session');
      }
    } catch (error) {
      console.error('Error loading session by ID:', error);
    }
  };

  const fetchLiveSessions = async () => {
    try {
      console.log('Fetching live sessions...');
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .not('agora_channel', 'is', null)
        .gte('scheduled_end', new Date().toISOString())
        .order('scheduled_start', { ascending: true });

      if (error) throw error;
      console.log('Fetched sessions:', data);
      setLiveSessions(data || []);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const handleJoinClass = (channel: string, asTeacher: boolean = false) => {
    if (!channel.trim()) {
      alert('Please enter a channel name');
      return;
    }
    
    console.log('Joining class:', channel, 'as teacher:', asTeacher);
    setChannelName(channel);
    setIsTeacher(asTeacher);
    setShowLiveClass(true);
  };

  const joinLiveSession = (session: LiveSession) => {
    if (session.agora_channel) {
      console.log('Joining live session:', session);
      handleJoinClass(session.agora_channel, false);
    }
  };

  const isSessionLive = (session: LiveSession) => {
    const now = new Date();
    const start = new Date(session.scheduled_start);
    const end = new Date(session.scheduled_end);
    return now >= start && now <= end;
  };

  // Debug current state
  const debugInfo = {
    showLiveClass,
    channelName,
    isTeacher,
    hasChannel: !!channelName,
    channelLength: channelName.length,
    shouldRenderLiveClass: showLiveClass && channelName && channelName.trim() !== '',
    searchParamsChannel: searchParams.get('channel'),
    searchParamsTeacher: searchParams.get('teacher')
  };
  
  console.log('=== Current State Debug ===', debugInfo);

  // IMPORTANT: Check if we should render LiveClass
  if (showLiveClass && channelName && channelName.trim() !== '') {
    console.log('✅ RENDERING LiveClass component with channel:', channelName);
    return (
      <LiveClass 
        channelName={channelName}
        appId={AGORA_APP_ID}
        isTeacher={isTeacher}
      />
    );
  }

  console.log('❌ NOT rendering LiveClass - showing main interface instead');

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live Classes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join ongoing classes or start a new session
          </p>
        </div>

        {/* Enhanced Debug Info */}
        <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
              <AlertCircle className="h-5 w-5 mr-2" />
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Current path:</strong> {location.pathname}</p>
              <p><strong>Session ID from URL:</strong> {sessionId || 'None'}</p>
              <p><strong>Channel from query:</strong> {searchParams.get('channel') || 'None'}</p>
              <p><strong>Teacher mode:</strong> {searchParams.get('teacher') || 'false'}</p>
              <p><strong>Current channel:</strong> '{channelName}' (length: {channelName.length})</p>
              <p><strong>Show Live Class:</strong> {showLiveClass ? 'Yes' : 'No'}</p>
              <p><strong>Should render LiveClass:</strong> {debugInfo.shouldRenderLiveClass ? '✅ YES' : '❌ NO'}</p>
              <p><strong>Live sessions found:</strong> {liveSessions.length}</p>
              {channelName && (
                <p><strong>Channel valid:</strong> {channelName.trim() !== '' ? '✅ Valid' : '❌ Empty'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800 dark:text-green-200">
              <Video className="h-5 w-5 mr-2" />
              Live Video Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-green-700 dark:text-green-300">
                Your Agora video integration is configured and ready to use. You can now:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-green-700 dark:text-green-300">
                <li>Join existing live classes</li>
                <li>Start new teaching sessions</li>
                <li>Experience real-time video communication</li>
                <li>Use interactive features like hand raising</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Live Sessions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Live & Scheduled Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading live sessions...</div>
            ) : liveSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No live classes scheduled at the moment
              </div>
            ) : (
              <div className="space-y-4">
                {liveSessions.map((session) => {
                  const isLive = isSessionLive(session);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.scheduled_start).toLocaleString()} - {new Date(session.scheduled_end).toLocaleString()}
                        </p>
                        {session.agora_channel && (
                          <p className="text-xs text-gray-500">Channel: {session.agora_channel}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={isLive ? 'bg-red-500' : 'bg-blue-500'}>
                          {isLive ? 'LIVE' : 'Scheduled'}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => joinLiveSession(session)}
                          disabled={!session.agora_channel}
                          className={isLive ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          {isLive ? 'Join Live' : 'Join'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Join Existing Class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Join a Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-channel">Class Channel Name</Label>
                <Input 
                  id="join-channel"
                  placeholder="Enter channel name (e.g., math-101)"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleJoinClass(channelName, false)}
                disabled={!channelName.trim()}
                className="w-full"
              >
                Join as Student
              </Button>
            </CardContent>
          </Card>

          {/* Start New Class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Start a Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-channel">New Class Channel Name</Label>
                <Input 
                  id="start-channel"
                  placeholder="Create channel name (e.g., physics-201)"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleJoinClass(channelName, true)}
                disabled={!channelName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start as Teacher
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveClassRoom;
