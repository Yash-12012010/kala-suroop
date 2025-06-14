
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

const Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: 'New Course Launch: Advanced Watercolor Techniques',
      date: '2024-01-15',
      admin: 'Master Artist Priya',
      content: 'We are excited to announce the launch of our new Advanced Watercolor Techniques course. This comprehensive course covers traditional and contemporary watercolor methods for creating stunning artworks.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Art Exhibition Schedule Update',
      date: '2024-01-12',
      admin: 'Kala Suroop Team',
      content: 'Please note that there will be no live classes from January 20-22 due to our annual student art exhibition. All recorded sessions will remain available.',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'New Digital Art Resources Available',
      date: '2024-01-10',
      admin: 'Content Team',
      content: 'Updated digital art tutorials and brush sets are now available in your dashboard. These include new techniques for digital painting and illustration.',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Artist Showcase Meeting Scheduled',
      date: '2024-01-08',
      admin: 'Creative Team',
      content: 'Virtual artist showcase meetings are scheduled for January 25th. Students will present their artworks and receive feedback from master artists.',
      priority: 'high'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 lg:mb-4">
            Kala Suroop Announcements
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
            Stay updated with the latest news from our art community
          </p>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="pb-3 lg:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white sm:pr-4">
                    {announcement.title}
                  </CardTitle>
                  <Badge className={`${getPriorityColor(announcement.priority)} text-white w-fit text-xs border-0`}>
                    {announcement.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs lg:text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    {new Date(announcement.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <User className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    {announcement.admin}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
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
