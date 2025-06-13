
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

const Timetable = () => {
  const [selectedDay, setSelectedDay] = useState('');

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const schedule = {
    'Monday': {
      '9:00 AM': { subject: 'Mathematics', teacher: 'Dr. Sharma', class: 'Class 10', type: 'Live' },
      '11:00 AM': { subject: 'Physics', teacher: 'Prof. Gupta', class: 'Class 11', type: 'Live' },
      '2:00 PM': { subject: 'Chemistry', teacher: 'Ms. Patel', class: 'Class 9', type: 'Recorded' },
      '4:00 PM': { subject: 'Biology', teacher: 'Dr. Singh', class: 'Class 10', type: 'Live' }
    },
    'Tuesday': {
      '10:00 AM': { subject: 'English', teacher: 'Ms. Verma', class: 'Class 11', type: 'Live' },
      '12:00 PM': { subject: 'Mathematics', teacher: 'Dr. Sharma', class: 'Class 9', type: 'Live' },
      '3:00 PM': { subject: 'Physics', teacher: 'Prof. Gupta', class: 'Class 10', type: 'Recorded' },
      '5:00 PM': { subject: 'Chemistry', teacher: 'Ms. Patel', class: 'Class 11', type: 'Live' }
    },
    'Wednesday': {
      '9:00 AM': { subject: 'Biology', teacher: 'Dr. Singh', class: 'Class 11', type: 'Live' },
      '11:00 AM': { subject: 'Mathematics', teacher: 'Dr. Sharma', class: 'Class 10', type: 'Live' },
      '1:00 PM': { subject: 'English', teacher: 'Ms. Verma', class: 'Class 9', type: 'Live' },
      '4:00 PM': { subject: 'Physics', teacher: 'Prof. Gupta', class: 'Class 11', type: 'Recorded' }
    },
    'Thursday': {
      '10:00 AM': { subject: 'Chemistry', teacher: 'Ms. Patel', class: 'Class 10', type: 'Live' },
      '12:00 PM': { subject: 'Biology', teacher: 'Dr. Singh', class: 'Class 9', type: 'Live' },
      '2:00 PM': { subject: 'Mathematics', teacher: 'Dr. Sharma', class: 'Class 11', type: 'Live' },
      '5:00 PM': { subject: 'English', teacher: 'Ms. Verma', class: 'Class 10', type: 'Recorded' }
    },
    'Friday': {
      '9:00 AM': { subject: 'Physics', teacher: 'Prof. Gupta', class: 'Class 9', type: 'Live' },
      '11:00 AM': { subject: 'Chemistry', teacher: 'Ms. Patel', class: 'Class 11', type: 'Live' },
      '1:00 PM': { subject: 'Biology', teacher: 'Dr. Singh', class: 'Class 10', type: 'Live' },
      '3:00 PM': { subject: 'Mathematics', teacher: 'Dr. Sharma', class: 'Class 10', type: 'Recorded' }
    },
    'Saturday': {
      '10:00 AM': { subject: 'English', teacher: 'Ms. Verma', class: 'Class 9', type: 'Live' },
      '12:00 PM': { subject: 'Physics', teacher: 'Prof. Gupta', class: 'Class 10', type: 'Live' },
      '2:00 PM': { subject: 'Chemistry', teacher: 'Ms. Patel', class: 'Class 11', type: 'Live' },
      '4:00 PM': { subject: 'Biology', teacher: 'Dr. Singh', class: 'Class 11', type: 'Recorded' }
    }
  };

  const getClassColor = (className: string) => {
    switch (className) {
      case 'Class 9': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Class 10': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Class 11': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Live' 
      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Weekly Timetable
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your complete schedule for live and recorded sessions
          </p>
        </div>

        {/* Mobile View - Day Selector */}
        <div className="lg:hidden mb-6">
          <div className="grid grid-cols-3 gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(selectedDay === day ? '' : day)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop View - Full Schedule Grid */}
        <div className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Weekly Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground border-b">
                        Time
                      </th>
                      {days.map((day) => (
                        <th key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-b">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time) => (
                      <tr key={time} className="border-b">
                        <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                          {time}
                        </td>
                        {days.map((day) => {
                          const session = schedule[day]?.[time];
                          return (
                            <td key={`${day}-${time}`} className="p-2">
                              {session ? (
                                <div className="group relative">
                                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                      {session.subject}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {session.teacher}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      <Badge variant="secondary" className={getClassColor(session.class)}>
                                        {session.class}
                                      </Badge>
                                      <Badge variant="secondary" className={getTypeColor(session.type)}>
                                        {session.type}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                    Click to join {session.type.toLowerCase()} session
                                  </div>
                                </div>
                              ) : (
                                <div className="h-20"></div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile View - Selected Day Schedule */}
        <div className="lg:hidden">
          {selectedDay ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedDay} Schedule
              </h2>
              {timeSlots.map((time) => {
                const session = schedule[selectedDay]?.[time];
                return session ? (
                  <Card key={time} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{time}</span>
                        </div>
                        <Badge variant="secondary" className={getTypeColor(session.type)}>
                          {session.type}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {session.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        by {session.teacher}
                      </p>
                      <Badge variant="secondary" className={getClassColor(session.class)}>
                        {session.class}
                      </Badge>
                    </CardContent>
                  </Card>
                ) : null;
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Select a day to view schedule</h3>
              <p className="text-muted-foreground">Choose a day from above to see your classes</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded"></div>
            <span className="text-sm text-muted-foreground">Live Session</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
            <span className="text-sm text-muted-foreground">Recorded Session</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded"></div>
            <span className="text-sm text-muted-foreground">Class 9</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
            <span className="text-sm text-muted-foreground">Class 10</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900 rounded"></div>
            <span className="text-sm text-muted-foreground">Class 11</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
