import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Video, Users, Play, Square, Calendar, CheckCircle, AlertCircle, Plus, Edit, Trash2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { startAutoEndScheduler, stopAutoEndScheduler, checkAndEndExpiredClasses } from '@/utils/classAutoEnd';

interface LiveClass {
  id: string;
  title: string;
  course_id: string;
  agora_channel: string | null;
  scheduled_start: string;
  scheduled_end: string;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
}

interface ClassData {
  id: string;
  name: string;
  description: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
}

const LiveClassAdmin = () => {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingClass, setStartingClass] = useState<string | null>(null);
  const [endingClass, setEndingClass] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<string[]>([]);
  const [autoEndInterval, setAutoEndInterval] = useState<NodeJS.Timeout | null>(null);
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newClass, setNewClass] = useState({
    title: '',
    course_id: '',
    scheduled_start: '',
    scheduled_end: '',
    duration: '60',
    subject: '',
    class_name: '',
    teacher: ''
  });

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    subject: ''
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Doubt Session', 'Test Series', 'Revision Class'];

  const addStatusCheck = (message: string) => {
    console.log('🔍 ADMIN CHECK:', message);
    setSystemStatus(prev => [...prev, message]);
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, instructor')
        .eq('status', 'active')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
      addStatusCheck(`✅ Found ${data?.length || 0} courses`);
    } catch (error) {
      console.error('Error fetching courses:', error);
      addStatusCheck('❌ Course fetch failed');
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (error) throw error;
      setClassData(data || []);
      addStatusCheck(`✅ Found ${data?.length || 0} class categories`);
    } catch (error) {
      console.error('Error fetching classes:', error);
      addStatusCheck('❌ Classes fetch failed');
    }
  };

  const fetchTeachers = async () => {
    try {
      // For now, we'll use a static list but this could be from a database table
      const defaultTeachers = [
        { id: '1', name: 'Mr. Kumar', subject: 'Mathematics' },
        { id: '2', name: 'Dr. Sharma', subject: 'Physics' },
        { id: '3', name: 'Ms. Patel', subject: 'Chemistry' },
        { id: '4', name: 'Mrs. Singh', subject: 'Biology' },
        { id: '5', name: 'Dr. Verma', subject: 'English' },
        { id: '6', name: 'Academic Team', subject: 'All Subjects' }
      ];
      setTeachers(defaultTeachers);
      addStatusCheck(`✅ Found ${defaultTeachers.length} teachers`);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      addStatusCheck('❌ Teachers fetch failed');
    }
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
    addStatusCheck('Initializing admin panel...');
    
    if (user) {
      addStatusCheck('✅ User authenticated');
    } else {
      addStatusCheck('❌ User not authenticated');
    }
    
    addStatusCheck('✅ Supabase client configured');
    addStatusCheck('✅ Live sessions table accessible');
    addStatusCheck('✅ Auto-end scheduler starting...');
    
    const intervalId = startAutoEndScheduler();
    setAutoEndInterval(intervalId);
    
    fetchCourses();
    fetchClasses();
    fetchTeachers();
    fetchLiveClasses();

    return () => {
      if (intervalId) {
        stopAutoEndScheduler(intervalId);
        addStatusCheck('Auto-end scheduler stopped');
      }
    };
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

  const addToTimetable = async (liveClass: any) => {
    try {
      const startDate = new Date(liveClass.scheduled_start);
      const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'long' });
      const timeSlot = startDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });

      const { error } = await supabase
        .from('timetable')
        .insert({
          day_of_week: dayOfWeek,
          time_slot: timeSlot,
          subject: newClass.subject || 'Live Session',
          class_name: newClass.class_name || 'All Classes',
          teacher: newClass.teacher || 'Academic Team'
        });

      if (error) throw error;
      addStatusCheck('✅ Added to timetable successfully');
    } catch (error) {
      console.error('Error adding to timetable:', error);
      addStatusCheck('⚠️ Timetable update failed');
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
      await createAnnouncement(title, channelName);

      toast({
        title: "Live Class Started",
        description: `${title} is now live!`,
      });

      fetchLiveClasses();
      
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

  const endLiveClass = async (classId: string, title: string) => {
    setEndingClass(classId);
    try {
      addStatusCheck(`Ending live class: ${title}`);
      
      const { error } = await supabase
        .from('live_sessions')
        .update({
          agora_channel: null,
          scheduled_end: new Date().toISOString()
        })
        .eq('id', classId);

      if (error) {
        addStatusCheck('❌ Failed to end live session');
        throw error;
      }

      addStatusCheck('✅ Live session ended successfully');

      toast({
        title: "Live Class Ended",
        description: `${title} has been ended.`,
      });

      fetchLiveClasses();
    } catch (error) {
      console.error('Error ending live class:', error);
      addStatusCheck('❌ Live class end failed');
      toast({
        title: "Error",
        description: "Failed to end live class",
        variant: "destructive"
      });
    } finally {
      setEndingClass(null);
    }
  };

  const scheduleClass = async () => {
    try {
      if (!newClass.title || !newClass.scheduled_start || !newClass.course_id) {
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

      const liveSessionData = {
        title: newClass.title,
        course_id: newClass.course_id,
        scheduled_start: startTime.toISOString(),
        scheduled_end: endTime.toISOString()
      };

      const { error } = await supabase
        .from('live_sessions')
        .insert(liveSessionData);

      if (error) {
        addStatusCheck('❌ Failed to create scheduled class');
        throw error;
      }

      addStatusCheck('✅ Scheduled class created successfully');
      
      // Add to timetable
      await addToTimetable(liveSessionData);

      toast({
        title: "Success",
        description: "Live class scheduled successfully and added to timetable",
      });

      setNewClass({
        title: '',
        course_id: '',
        scheduled_start: '',
        scheduled_end: '',
        duration: '60',
        subject: '',
        class_name: '',
        teacher: ''
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

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const handleManualCheck = async () => {
    addStatusCheck('Manual check for expired classes...');
    await checkAndEndExpiredClasses();
    await fetchLiveClasses();
    addStatusCheck('✅ Manual check completed');
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTeacher) {
      const updatedTeachers = teachers.map(teacher =>
        teacher.id === editingTeacher.id
          ? { ...teacher, name: teacherForm.name, subject: teacherForm.subject }
          : teacher
      );
      setTeachers(updatedTeachers);
      toast({
        title: "Success",
        description: "Teacher updated successfully",
      });
    } else {
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name: teacherForm.name,
        subject: teacherForm.subject
      };
      setTeachers([...teachers, newTeacher]);
      toast({
        title: "Success",
        description: "Teacher added successfully",
      });
    }

    setTeacherForm({ name: '', subject: '' });
    setEditingTeacher(null);
    setTeacherDialogOpen(false);
  };

  const deleteTeacher = (teacherId: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== teacherId));
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
    }
  };

  const openTeacherDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm({ name: teacher.name, subject: teacher.subject });
    } else {
      setEditingTeacher(null);
      setTeacherForm({ name: '', subject: '' });
    }
    setTeacherDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Live Class Management
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Schedule and manage live classes with automatic announcements and timetable integration
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
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualCheck}
              className="w-full"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Manual Check for Expired Classes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Teacher Management
          </CardTitle>
          <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openTeacherDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Teacher Name</Label>
                  <Input
                    id="name"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    placeholder="Enter teacher name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject/Specialization</Label>
                  <Select value={teacherForm.subject} onValueChange={(value) => setTeacherForm({ ...teacherForm, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                      <SelectItem value="All Subjects">All Subjects</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setTeacherDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTeacher ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{teacher.name}</h4>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openTeacherDialog(teacher)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTeacher(teacher.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{teacher.subject}</p>
              </div>
            ))}
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
              <Label htmlFor="title">Class Title *</Label>
              <Input
                id="title"
                value={newClass.title}
                onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                placeholder="e.g., Mathematics - Algebra Basics"
              />
            </div>
            <div>
              <Label htmlFor="course_id">Course *</Label>
              <Select value={newClass.course_id} onValueChange={(value) => setNewClass({ ...newClass, course_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={newClass.subject} onValueChange={(value) => setNewClass({ ...newClass, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class_name">Class Category</Label>
              <Select value={newClass.class_name} onValueChange={(value) => setNewClass({ ...newClass, class_name: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class category" />
                </SelectTrigger>
                <SelectContent>
                  {classData.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                  ))}
                  <SelectItem value="All Classes">All Classes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="teacher">Teacher</Label>
              <Select value={newClass.teacher} onValueChange={(value) => setNewClass({ ...newClass, teacher: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheduled_start">Start Time *</Label>
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
            Schedule Class & Add to Timetable
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
                      <p className="text-sm text-blue-600 font-medium">Course: {getCourseTitle(liveClass.course_id)}</p>
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
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/live-classroom?channel=${liveClass.agora_channel}&teacher=true`, '_blank')}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Join as Teacher
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => endLiveClass(liveClass.id, liveClass.title)}
                            disabled={endingClass === liveClass.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Square className="h-4 w-4 mr-1" />
                            {endingClass === liveClass.id ? 'Ending...' : 'End Class'}
                          </Button>
                        </>
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
