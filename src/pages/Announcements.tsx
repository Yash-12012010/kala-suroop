
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

const Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: 'New Course Launch: Advanced Physics',
      date: '2024-01-15',
      admin: 'Dr. Sharma',
      content: 'We are excited to announce the launch of our new Advanced Physics course for Class 11 students. This comprehensive course covers all topics required for board exams and competitive entrance tests.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Holiday Schedule Update',
      date: '2024-01-12',
      admin: 'Admin Team',
      content: 'Please note that there will be no live classes from January 20-22 due to the national holiday. All recorded sessions will remain available.',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'New Study Materials Available',
      date: '2024-01-10',
      admin: 'Content Team',
      content: 'Updated study materials for Mathematics and Science are now available in your dashboard. These include practice questions and detailed solutions.',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Parent-Teacher Meeting Scheduled',
      date: '2024-01-08',
      admin: 'Academic Team',
      content: 'Virtual parent-teacher meetings are scheduled for January 25th. Please check your registered email for the meeting links and timing.',
      priority: 'high'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Announcements
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay updated with the latest news and announcements
          </p>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl text-gray-900 dark:text-white pr-4">
                    {announcement.title}
                  </CardTitle>
                  <Badge className={`${getPriorityColor(announcement.priority)} text-white`}>
                    {announcement.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(announcement.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {announcement.admin}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {announcement.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
