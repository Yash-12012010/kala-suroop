
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Timetable = () => {
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const schedule = {
    'Monday': {
      '09:00 AM': { subject: 'Mathematics', class: 'Class 10', teacher: 'Mr. Kumar' },
      '11:00 AM': { subject: 'Physics', class: 'Class 11', teacher: 'Dr. Sharma' },
      '03:00 PM': { subject: 'Chemistry', class: 'Class 9', teacher: 'Ms. Patel' },
    },
    'Tuesday': {
      '10:00 AM': { subject: 'English', class: 'Class 10', teacher: 'Mrs. Singh' },
      '02:00 PM': { subject: 'Biology', class: 'Class 11', teacher: 'Dr. Verma' },
      '04:00 PM': { subject: 'Mathematics', class: 'Class 9', teacher: 'Mr. Kumar' },
    },
    'Wednesday': {
      '09:00 AM': { subject: 'Chemistry', class: 'Class 11', teacher: 'Ms. Patel' },
      '11:00 AM': { subject: 'Physics', class: 'Class 10', teacher: 'Dr. Sharma' },
      '03:00 PM': { subject: 'English', class: 'Class 9', teacher: 'Mrs. Singh' },
    },
    'Thursday': {
      '10:00 AM': { subject: 'Mathematics', class: 'Class 11', teacher: 'Mr. Kumar' },
      '12:00 PM': { subject: 'Biology', class: 'Class 10', teacher: 'Dr. Verma' },
      '04:00 PM': { subject: 'Physics', class: 'Class 9', teacher: 'Dr. Sharma' },
    },
    'Friday': {
      '09:00 AM': { subject: 'English', class: 'Class 11', teacher: 'Mrs. Singh' },
      '11:00 AM': { subject: 'Chemistry', class: 'Class 10', teacher: 'Ms. Patel' },
      '02:00 PM': { subject: 'Mathematics', class: 'Class 9', teacher: 'Mr. Kumar' },
    },
    'Saturday': {
      '10:00 AM': { subject: 'Doubt Session', class: 'All Classes', teacher: 'All Teachers' },
      '02:00 PM': { subject: 'Test Series', class: 'Class 10', teacher: 'Academic Team' },
    },
    'Sunday': {
      '11:00 AM': { subject: 'Revision Class', class: 'Class 11', teacher: 'All Teachers' },
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Physics': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Chemistry': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Biology': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'English': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Doubt Session': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Test Series': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Revision Class': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Class Timetable
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Weekly schedule for live classes and sessions
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {/* Header */}
                  <div className="font-semibold text-center py-2">Time</div>
                  {days.map(day => (
                    <div key={day} className="font-semibold text-center py-2">
                      {day}
                    </div>
                  ))}

                  {/* Time slots and classes */}
                  {timeSlots.map(time => (
                    <React.Fragment key={time}>
                      <div className="text-sm font-medium text-center py-4 border-r">
                        {time}
                      </div>
                      {days.map(day => {
                        const classInfo = schedule[day]?.[time];
                        return (
                          <div key={`${day}-${time}`} className="p-2 min-h-[80px] border">
                            {classInfo ? (
                              <div className={`p-2 rounded-lg h-full ${getSubjectColor(classInfo.subject)}`}>
                                <div className="font-semibold text-xs mb-1">
                                  {classInfo.subject}
                                </div>
                                <div className="text-xs opacity-90">
                                  {classInfo.class}
                                </div>
                                <div className="text-xs opacity-75 mt-1">
                                  {classInfo.teacher}
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                                -
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Live classes are conducted via video conferencing
              </p>
              <p className="text-sm text-muted-foreground">
                • Recordings are available for 24 hours after the session
              </p>
              <p className="text-sm text-muted-foreground">
                • Doubt sessions are interactive Q&A sessions
              </p>
              <p className="text-sm text-muted-foreground">
                • Test series includes practice tests and mock exams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys({
                  'Mathematics': '', 'Physics': '', 'Chemistry': '', 'Biology': '',
                  'English': '', 'Doubt Session': '', 'Test Series': '', 'Revision Class': ''
                }).map(subject => (
                  <Badge key={subject} className={getSubjectColor(subject)}>
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
