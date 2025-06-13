
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, User } from 'lucide-react';

const Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: 'New Course Launch: Advanced Physics for Class 12',
      date: '2024-06-10',
      admin: 'Dr. Sharma',
      adminInitials: 'DS',
      content: `We're excited to announce the launch of our new **Advanced Physics** course for Class 12 students! 

This comprehensive course covers:
- Electromagnetic waves and optics
- Modern physics concepts
- Quantum mechanics basics
- Nuclear physics

*Early bird discount of 30% available until June 20th!*`,
      type: 'Course Launch',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Maintenance Schedule - June 15th',
      date: '2024-06-08',
      admin: 'System Admin',
      adminInitials: 'SA',
      content: `Our platform will undergo scheduled maintenance on **June 15th** from 2:00 AM to 4:00 AM IST.

During this time:
- All courses will be temporarily unavailable
- Live sessions will be rescheduled
- Practice tests will be accessible in offline mode

We apologize for any inconvenience caused.`,
      type: 'Maintenance',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Exam Preparation Workshop - Class 10 Mathematics',
      date: '2024-06-05',
      admin: 'Prof. Gupta',
      adminInitials: 'PG',
      content: `Join us for an intensive **Mathematics Exam Preparation Workshop** for Class 10 students!

**Details:**
- Date: June 18th, 2024
- Time: 4:00 PM - 6:00 PM IST
- Topics: Algebra, Geometry, Trigonometry
- Live Q&A session included

*Registration is free for enrolled students!*`,
      type: 'Workshop',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Mobile App Update - Version 2.1',
      date: '2024-06-03',
      admin: 'Tech Team',
      adminInitials: 'TT',
      content: `We've released a new version of our mobile app with exciting features:

**New Features:**
- Dark mode support
- Offline video downloads
- Push notifications for assignments
- Improved quiz interface

Update now from your app store!`,
      type: 'Update',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Summer Batch Registrations Open',
      date: '2024-06-01',
      admin: 'Ms. Patel',
      adminInitials: 'MP',
      content: `Summer batch registrations are now open for all classes!

**Special Summer Features:**
- Intensive 2-month courses
- Small batch sizes (max 15 students)
- Daily live sessions
- Personal mentorship

*Limited seats available. Register before June 30th!*`,
      type: 'Registration',
      priority: 'high'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .split('\n')
      .map((line, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: line }} className="mb-2 last:mb-0" />
      ));
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Announcements
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay updated with the latest news and important updates
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getPriorityColor(announcement.priority)} text-white`}
                      >
                        {announcement.type}
                      </Badge>
                      {announcement.priority === 'high' && (
                        <Badge variant="destructive">Important</Badge>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {announcement.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(announcement.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {announcement.adminInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{announcement.admin}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                  {renderMarkdown(announcement.content)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">No announcements yet</h3>
            <p className="text-muted-foreground">Check back later for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
