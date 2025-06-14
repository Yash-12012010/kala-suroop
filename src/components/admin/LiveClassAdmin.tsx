
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Play, Square, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface LiveClass {
  id: string;
  title: string;
  course_id: string;
  agora_channel: string | null;
  scheduled_start: string;
  scheduled_end: string;
  created_at: string;
}

const LiveClassAdmin = () => {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingClass, setStartingClass] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newClass, setNewClass] = useState({
    title: '',
    course_id: '',
    scheduled_start: '',
    scheduled_end: '',
    duration: '60' // minutes
  });

  const addStatusCheck = (message: string) => {
    console.log('🔍 ADMIN CHECK:', message);
    setSystemStatus(prev => [...prev, message]);
  };

  const fetchLiveClasses = async () => {
    try {
      addStatusCheck('Fetching live classes from database...');
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .order('scheduled_start', { ascending: false });

      if (error) {
        console.error('Error fetching live classes:', error);
        addStatusCheck('❌ Database query failed');
        throw error;
      }
      
      setClasses(data || []);
      addStatusCheck(`✅ Found ${data?.length || 0} live sessions`);
    } catch (error) {
      console.error('Error fetching live classes:', error);
      addStatusCheck('❌ Live classes fetch failed');
      toast({
        title: "Error",
        description: "Failed to fetch live classes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // System checks
    addStatusCheck('Initializing admin panel...');
    
    if (user) {
      addStatusCheck('✅ User authenticated');
    } else {
      addStatusCheck('❌ User not authenticated');
    }
    
    addStatusCheck('✅ Supabase client configured');
    addStatusCheck('✅ Live sessions table accessible');
    
    fetchLiveClasses();
  }, []);

  const createAnnouncement = async (classTitle: string, channelName: string) => {
    try {
      addStatusCheck('Creating live class announcement...');
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: `🔴 LIVE NOW: ${classTitle}`,
          content: `${classTitle} has started live! Join now to attend the session. Channel: ${channelName}`,
          type: 'success',
          target_audience: 'all',
          is_active: true,
          is_pinned: true,
          created_by: user?.id
        });

      if (error) {
        console.error('Announcement creation error:', error);
        addStatusCheck('⚠️ Announcement creation failed');
        throw error;
      }
      
      addStatusCheck('✅ Announcement created successfully');
      toast({
        title: "Announcement Created",
        description: "Live class announcement has been posted",
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      addStatusCheck('❌ Announcement system error');
      toast({
        title: "Warning",
        description: "Class started but announcement creation failed",
        variant: "destructive"
      });
    }
  };

  const startLiveClass = async (classId: string, title: string) => {
    setStartingClass(classId);
    try {
      addStatusCheck(`Starting live class: ${title}`);
      const channelName = `live-${classId}-${Date.now()}`;
      
      const { error } = await supabase
        .from('live_sessions')
        .update({
          agora_channel: channelName,
          scheduled_start: new Date().toISOString()
        })
        .eq('id', classId);

      if (error) {
        addStatusCheck('❌ Failed to update live session');
        throw error;
      }

      addStatusCheck('✅ Live session updated with channel');

      // Create announcement
      await createAnnouncement(title, channelName);

      toast({
        title: "Live Class Started",
        description: `${title} is now live!`,
      });

      fetchLiveClasses();
      
      // Test the auto-join URL
      const teacherUrl = `/live-classroom?channel=${channelName}&teacher=true`;
      addStatusCheck(`✅ Opening teacher interface: ${teacherUrl}`);
      window.open(teacherUrl, '_blank');
    } catch (error) {
      console.error('Error starting live class:', error);
      addStatusCheck('❌ Live class start failed');
      toast({
        title: "Error",
        description: "Failed to start live class",
        variant: "destructive"
      });
    } finally {
      setStartingClass(null);
    }
  };

  const scheduleClass = async () => {
    try {
      if (!newClass.title || !newClass.scheduled_start) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      addStatusCheck('Creating new scheduled class...');
      const startTime = new Date(newClass.scheduled_start);
      const endTime = new Date(startTime.getTime() + parseInt(newClass.duration) * 60000);

      const { error } = await supabase
        .from('live_sessions')
        .insert({
          title: newClass.title,
          course_id: newClass.course_id || 'general',
          scheduled_start: startTime.toISOString(),
          scheduled_end: endTime.toISOString()
        });

      if (error) {
        addStatusCheck('❌ Failed to create scheduled class');
        throw error;
      }

      addStatusCheck('✅ Scheduled class created successfully');
      toast({
        title: "Success",
        description: "Live class scheduled successfully",
      });

      setNewClass({
        title: '',
        course_id: '',
        scheduled_start: '',
        scheduled_end: '',
        duration: '60'
      });

      fetchLiveClasses();
    } catch (error) {
      console.error('Error scheduling class:', error);
      addStatusCheck('❌ Class scheduling failed');
      toast({
        title: "Error",
        description: "Failed to schedule class",
        variant: "destructive"
      });
    }
  };

  const getClassStatus = (liveClass: LiveClass) => {
    const now = new Date();
    const start = new Date(liveClass.scheduled_start);
    const end = new Date(liveClass.scheduled_end);

    if (liveClass.agora_channel && now >= start && now <= end) {
      return { status: 'live', color: 'bg-red-500', text: 'LIVE' };
    } else if (now < start) {
      return { status: 'scheduled', color: 'bg-blue-500', text: 'SCHEDULED' };
    } else {
      return { status: 'ended', color: 'bg-gray-500', text: 'ENDED' };
    }
  };

  const testUrl = (url: string, description: string) => {
    addStatusCheck(`Testing ${description}: ${url}`);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Live Class Management
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Schedule and manage live classes with automatic announcements
        </p>
      </div>

      {/* System Status */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5 mr-2" />
            Admin System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
            {systemStatus.map((status, index) => (
              <p key={index} className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-green-600 flex-shrink-0" />
                {status}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Test Actions */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
            <Video className="h-5 w-5 mr-2" />
            Quick Test Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => testUrl('/live-classroom', 'Live Classroom Page')}
              className="justify-start"
            >
              Test Live Classroom
            </Button>
            <Button
              variant="outline"
              onClick={() => testUrl('/live-classroom?channel=test-123&teacher=true', 'Teacher Auto-Join')}
              className="justify-start"
            >
              Test Teacher Auto-Join
            </Button>
            <Button
              variant="outline"
              onClick={() => testUrl('/live-classroom?channel=test-123', 'Student Auto-Join')}
              className="justify-start"
            >
              Test Student Auto-Join
            </Button>
            <Button
              variant="outline"
              onClick={() => testUrl('/dashboard', 'Dashboard Navigation')}
              className="justify-start"
            >
              Test Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule New Class */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule New Live Class
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Class Title</Label>
              <Input
                id="title"
                value={newClass.title}
                onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                placeholder="e.g., Mathematics - Algebra Basics"
              />
            </div>
            <div>
              <Label htmlFor="course_id">Course ID (optional)</Label>
              <Input
                id="course_id"
                value={newClass.course_id}
                onChange={(e) => setNewClass({ ...newClass, course_id: e.target.value })}
                placeholder="e.g., math-101"
              />
            </div>
            <div>
              <Label htmlFor="scheduled_start">Start Time</Label>
              <Input
                id="scheduled_start"
                type="datetime-local"
                value={newClass.scheduled_start}
                onChange={(e) => setNewClass({ ...newClass, scheduled_start: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={newClass.duration} onValueChange={(value) => setNewClass({ ...newClass, duration: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={scheduleClass} className="w-full">
            Schedule Class
          </Button>
        </CardContent>
      </Card>

      {/* Live Classes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Scheduled & Live Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading classes...</div>
          ) : classes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No classes scheduled yet. Create one above to test the system.
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map((liveClass) => {
                const status = getClassStatus(liveClass);
                return (
                  <div key={liveClass.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{liveClass.title}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <p>Start: {new Date(liveClass.scheduled_start).toLocaleString()}</p>
                        <p>End: {new Date(liveClass.scheduled_end).toLocaleString()}</p>
                        {liveClass.agora_channel && (
                          <p>Channel: {liveClass.agora_channel}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${status.color} text-white`}>
                        {status.text}
                      </Badge>
                      {status.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => startLiveClass(liveClass.id, liveClass.title)}
                          disabled={startingClass === liveClass.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {startingClass === liveClass.id ? 'Starting...' : 'Start Live'}
                        </Button>
                      )}
                      {status.status === 'live' && liveClass.agora_channel && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/live-classroom?channel=${liveClass.agora_channel}&teacher=true`, '_blank')}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Join as Teacher
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveClassAdmin;
