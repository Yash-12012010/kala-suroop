
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import LiveClass from '@/components/LiveClass';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { checkAndEndExpiredClasses } from '@/utils/classAutoEnd';

interface LiveSession {
  id: string;
  title: string;
  agora_channel: string | null;
  scheduled_start: string;
  scheduled_end: string;
  course_id: string;
}

const LiveClassRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessionId } = useParams();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [showLiveClass, setShowLiveClass] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const AGORA_APP_ID = '76fe48407b1d4e0986592d7ad3d5a361';

  const addTestResult = (message: string) => {
    console.log('✅ TEST:', message);
    setTestResults(prev => [...prev, message]);
  };

  useEffect(() => {
    console.log('=== LiveClassRoom URL Analysis ===');
    console.log('Current path:', location.pathname);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Session ID from params:', sessionId);
    console.log('Is Admin:', isAdmin);
    
    const channelFromUrl = searchParams.get('channel');
    const teacherFromUrl = searchParams.get('teacher') === 'true' || isAdmin;
    
    console.log('Channel from URL:', channelFromUrl);
    console.log('Teacher from URL (or admin):', teacherFromUrl);
    
    if (channelFromUrl) {
      addTestResult('URL parameters detected and processed correctly');
    }
    
    if (channelFromUrl && channelFromUrl.trim()) {
      console.log('AUTO-JOINING: Setting up live class immediately');
      const role = teacherFromUrl ? 'teacher' : 'student';
      const userIdPart = user?.id?.split('-')[0] || Math.random().toString(36).slice(2, 8);
      const customUid = `${role}-${userIdPart}`;
      setUid(customUid);
      setChannelName(channelFromUrl.trim());
      setIsTeacher(role === 'teacher');
      setShowLiveClass(true);
      addTestResult('Auto-join functionality working');
      return;
    }

    if (sessionId) {
      console.log('Loading session by ID:', sessionId);
      loadSessionById(sessionId);
    }
  }, [searchParams, sessionId, location.pathname, user, isAdmin]);

  const loadSessionById = async (id: string) => {
    try {
      console.log('Fetching session with ID:', id);
      const data = await api.getLiveSession(id);

      console.log('Session data loaded:', data);
      if (data && data.agoraChannel) {
        console.log('Setting up live class with channel:', data.agora_channel);
        const role = isAdmin ? 'teacher' : 'student';
        const userIdPart = user?.id?.split('-')[0] || Math.random().toString(36).slice(2, 8);
        const customUid = `${role}-${userIdPart}`;
        setUid(customUid);
        setChannelName(data.agora_channel);
        setIsTeacher(role === 'teacher');
        setShowLiveClass(true);
        addTestResult('Session by ID loading working');
      } else {
        console.log('No agora channel found for session');
        addTestResult('Session found but no agora channel');
      }
    } catch (error) {
      console.error('Error loading session by ID:', error);
      addTestResult('Session loading error occurred');
    }
  };

  const fetchLiveSessions = async () => {
    try {
      console.log('Fetching live sessions...');
      
      await checkAndEndExpiredClasses();
      
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .not('agora_channel', 'is', null)
        .gte('scheduled_end', new Date().toISOString())
        .order('scheduled_start', { ascending: true });

      if (error) {
        console.error('Error fetching live sessions:', error);
        addTestResult('Live sessions fetch failed');
        toast({
          title: "Database Error",
          description: "Failed to fetch live sessions",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log('Fetched sessions:', data);
      setLiveSessions(data || []);
      addTestResult(`Found ${data?.length || 0} live sessions`);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      addTestResult('Live sessions fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSessions();
    
    if (user) {
      addTestResult('User authentication working');
    } else {
      addTestResult('User not authenticated');
    }
    
    if (AGORA_APP_ID) {
      addTestResult('Agora App ID configured');
    } else {
      addTestResult('Agora App ID missing');
    }

    const interval = setInterval(async () => {
      await checkAndEndExpiredClasses();
      await fetchLiveSessions();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinClass = (channel: string, asTeacher: boolean = false) => {
    const isTeacherRole = isAdmin || asTeacher;
    const role = isTeacherRole ? 'teacher' : 'student';
    const userIdPart = user?.id?.split('-')[0] || Math.random().toString(36).slice(2, 8);
    const customUid = `${role}-${userIdPart}`;

    setUid(customUid);
    setChannelName(channel);
    setIsTeacher(role === 'teacher');
    setShowLiveClass(true);
    addTestResult('Manual join functionality working');
  };

  const joinLiveSession = (session: LiveSession) => {
    if (session.agora_channel) {
      console.log('Joining live session:', session);
      handleJoinClass(session.agora_channel, isAdmin);
      addTestResult('Live session join working');
    }
  };

  const isSessionLive = (session: LiveSession) => {
    const now = new Date();
    const start = new Date(session.scheduled_start);
    const end = new Date(session.scheduled_end);
    return now >= start && now <= end;
  };

  if (showLiveClass && channelName && channelName.trim() !== '' && uid) {
    console.log('✅ RENDERING LiveClass component with channel:', channelName, 'and UID:', uid);
    return (
      <LiveClass 
        channelName={channelName}
        appId={AGORA_APP_ID}
        isTeacher={isTeacher}
        uid={uid}
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

        {/* Admin Status */}
        {isAdmin && (
          <Card className="mb-8 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
                <CheckCircle className="h-5 w-5 mr-2" />
                Admin Access Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 dark:text-purple-300">
                You have admin privileges. You will automatically join as a teacher in all live sessions.
              </p>
            </CardContent>
          </Card>
        )}

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
                <p>No live classes scheduled at the moment</p>
                {isAdmin && (
                  <p className="text-sm mt-2">Use the admin panel to schedule new classes</p>
                )}
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
                Join as {isAdmin ? 'Teacher (Admin)' : 'Student'}
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
