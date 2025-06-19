
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Users, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, type TimetableEntry as APITimetableEntry } from '@/lib/api';
import TimetableEditor from '@/components/TimetableEditor';

interface TimetableEntry {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  subject: string;
  className: string;
  teacher: string;
}

const Timetable = () => {
  const [scheduleData, setScheduleData] = useState<Record<string, Record<string, TimetableEntry>>>({});
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const subjectColors = {
    'Mathematics': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Physics': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Chemistry': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Biology': 'bg-red-500/20 text-red-300 border-red-500/30',
    'English': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Doubt Session': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Test Series': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Revision Class': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Live Session': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  };

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await api.getTimetable();

      const scheduleStructure: Record<string, Record<string, TimetableEntry>> = {};
      
      // Initialize all days
      days.forEach(day => {
        scheduleStructure[day] = {};
      });

      data?.forEach((entry) => {
        const mappedEntry: TimetableEntry = {
          id: entry.id,
          dayOfWeek: entry.dayOfWeek,
          timeSlot: entry.timeSlot,
          subject: entry.subject,
          className: entry.className,
          teacher: entry.teacher,
        };
        
        if (!scheduleStructure[entry.dayOfWeek]) {
          scheduleStructure[entry.dayOfWeek] = {};
        }
        scheduleStructure[entry.dayOfWeek][entry.timeSlot] = mappedEntry;
      });

      setScheduleData(scheduleStructure);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">Class Schedule</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Weekly
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Schedule
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
              Stay organized with your personalized class timetable and never miss a session
            </p>
          </div>

          {/* Admin Editor */}
          {isAdmin && (
            <div className="mb-8">
              <TimetableEditor scheduleData={scheduleData} onRefresh={fetchTimetable} />
            </div>
          )}

          {/* Schedule Info Cards - Fixed readability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/15 backdrop-blur-md border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                  Schedule Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/90">
                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5 text-purple-400" />
                  <span>Live classes are conducted via premium video conferencing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span>Recordings are available for 48 hours after each session</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-400" />
                  <span>Doubt sessions feature interactive Q&A with expert instructors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <span>Test series includes comprehensive practice tests and assessments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span>Live sessions automatically appear in your dashboard</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-md border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  Subject Legend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(subjectColors).map(([subject, colorClass]) => (
                    <Badge key={subject} className={`${colorClass} justify-center py-2 text-sm font-medium`}>
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Timetable - Fixed readability */}
          {loading ? (
            <Card className="bg-white/15 backdrop-blur-md border border-white/30 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-white">Loading your schedule...</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/15 backdrop-blur-md border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Calendar className="h-6 w-6 mr-3 text-purple-400" />
                  Weekly Timetable
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="p-3 text-center font-semibold text-white bg-white/10 rounded-lg border border-white/20">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-purple-400" />
                      Time
                    </div>
                    {days.map((day) => (
                      <div key={day} className="p-3 text-center font-semibold text-white bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg border border-white/20">
                        {day}
                      </div>
                    ))}
                  </div>

                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="grid grid-cols-8 gap-2 mb-2">
                      <div className="p-3 text-center font-medium text-white bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                        {timeSlot}
                      </div>
                      {days.map((day) => {
                        const classInfo = scheduleData[day]?.[timeSlot];
                        return (
                          <div key={`${day}-${timeSlot}`} className="min-h-[80px] p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300">
                            {classInfo ? (
                              <div className="h-full flex flex-col justify-between">
                                <div>
                                  <Badge className={`${subjectColors[classInfo.subject as keyof typeof subjectColors] || 'bg-gray-500/30 text-white border-gray-500/40'} text-xs mb-2 w-full justify-center font-medium`}>
                                    {classInfo.subject}
                                  </Badge>
                                  <p className="text-xs text-white font-medium mb-1">{classInfo.className}</p>
                                  <p className="text-xs text-white/80">{classInfo.teacher}</p>
                                </div>
                                <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-2 font-medium">
                                  <Video className="h-3 w-3 mr-1" />
                                  Join
                                </Button>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-white/60 text-xs font-medium">
                                No Class
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
