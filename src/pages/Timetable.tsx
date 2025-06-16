
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Video, Sparkles, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimetableEntry {
  id: string;
  day_of_week: string;
  time_slot: string;
  subject: string;
  class_name: string;
  teacher: string;
}

const Timetable = () => {
  const [schedule, setSchedule] = useState<Record<string, Record<string, TimetableEntry>>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetable')
        .select('*')
        .order('day_of_week')
        .order('time_slot');

      if (error) {
        console.error('Error fetching timetable:', error);
        toast({
          title: "Error",
          description: "Failed to fetch timetable data",
          variant: "destructive"
        });
        return;
      }

      // Convert array to nested object structure
      const scheduleData: Record<string, Record<string, TimetableEntry>> = {};
      
      data?.forEach((entry) => {
        if (!scheduleData[entry.day_of_week]) {
          scheduleData[entry.day_of_week] = {};
        }
        scheduleData[entry.day_of_week][entry.time_slot] = entry;
      });

      setSchedule(scheduleData);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast({
        title: "Error",
        description: "Failed to fetch timetable data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Physics': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Chemistry': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Biology': 'bg-red-500/20 text-red-300 border-red-500/30',
      'English': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Doubt Session': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Test Series': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Revision Class': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'Live Session': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    };
    return colors[subject] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>
        
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-white/80 text-lg">Loading premium schedule...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
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
                Timetable
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
              Your premium learning schedule with live classes and interactive sessions
            </p>
          </div>

          {/* Mobile View */}
          <div className="block lg:hidden mb-8">
            <div className="space-y-6">
              {days.map((day, dayIndex) => (
                <Card key={day} className="card-premium animate-slide-in-bottom" style={{ animationDelay: `${dayIndex * 100}ms` }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-white flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                      {day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timeSlots.map(time => {
                        const classInfo = schedule[day]?.[time];
                        return (
                          <div key={`${day}-${time}`} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-sm font-medium text-purple-300 min-w-[80px] flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {time}
                            </div>
                            <div className="flex-1">
                              {classInfo ? (
                                <div className={`p-4 rounded-xl border ${getSubjectColor(classInfo.subject)}`}>
                                  <div className="font-semibold text-sm mb-2 flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    {classInfo.subject}
                                  </div>
                                  <div className="text-xs opacity-90 mb-2">
                                    {classInfo.class_name}
                                  </div>
                                  <div className="text-xs opacity-75 flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {classInfo.teacher}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-purple-400 italic p-4 bg-white/5 rounded-xl border border-white/10">
                                  No class scheduled
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block animate-slide-in-bottom">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Calendar className="h-6 w-6 mr-3 text-purple-400" />
                  Weekly Class Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 gap-3">
                      {/* Header */}
                      <div className="font-semibold text-center py-4 bg-white/10 rounded-xl text-white flex items-center justify-center">
                        <Clock className="h-5 w-5 mr-2 text-purple-400" />
                        Time
                      </div>
                      {days.map(day => (
                        <div key={day} className="font-semibold text-center py-4 bg-white/10 rounded-xl text-white">
                          {day}
                        </div>
                      ))}

                      {/* Time slots and classes */}
                      {timeSlots.map(time => (
                        <div key={time} className="contents">
                          <div className="text-sm font-medium text-center py-6 bg-white/5 rounded-xl text-purple-300 flex items-center justify-center">
                            {time}
                          </div>
                          {days.map(day => {
                            const classInfo = schedule[day]?.[time];
                            return (
                              <div key={`${day}-${time}`} className="p-2 min-h-[120px] bg-white/5 rounded-xl border border-white/10">
                                {classInfo ? (
                                  <div className={`p-3 rounded-lg h-full border ${getSubjectColor(classInfo.subject)}`}>
                                    <div className="font-semibold text-xs mb-2 flex items-center">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      {classInfo.subject}
                                    </div>
                                    <div className="text-xs opacity-90 mb-2">
                                      {classInfo.class_name}
                                    </div>
                                    <div className="text-xs opacity-75 flex items-center">
                                      <Users className="h-3 w-3 mr-1" />
                                      {classInfo.teacher}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-purple-400 text-xs">
                                    -
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-premium animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-purple-200/80 flex items-start">
                  <Video className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                  Live classes are conducted via premium video conferencing
                </p>
                <p className="text-sm text-purple-200/80 flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                  Recordings are available for 48 hours after each session
                </p>
                <p className="text-sm text-purple-200/80 flex items-start">
                  <Users className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                  Doubt sessions feature interactive Q&A with expert instructors
                </p>
                <p className="text-sm text-purple-200/80 flex items-start">
                  <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                  Test series includes comprehensive practice tests and assessments
                </p>
                <p className="text-sm text-purple-200/80 flex items-start">
                  <Sparkles className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                  Live sessions automatically appear in your dashboard
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  Subject Legend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys({
                    'Mathematics': '', 'Physics': '', 'Chemistry': '', 'Biology': '',
                    'English': '', 'Doubt Session': '', 'Test Series': '', 'Revision Class': '',
                    'Live Session': ''
                  }).map(subject => (
                    <Badge key={subject} className={`${getSubjectColor(subject)} justify-center border py-2`}>
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
