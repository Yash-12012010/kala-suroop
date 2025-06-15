
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassManager from './ClassManager';
import TimetableManager from './TimetableManager';
import CourseManager from './CourseManager';
import StoreManager from './StoreManager';
import AnnouncementManager from './AnnouncementManager';
import BannerManager from './BannerManager';
import LiveClassAdmin from './LiveClassAdmin';
import NavigationManager from './NavigationManager';
import WebsiteSettingsManager from './WebsiteSettingsManager';
import WebsiteTemplateManager from './WebsiteTemplateManager';
import ContentEditor from './ContentEditor';

const WebsiteManager = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Website Administration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your website content, courses, and settings
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardTitle className="text-2xl font-bold text-center">Content Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8 h-12 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="courses" className="text-sm font-medium">Courses</TabsTrigger>
              <TabsTrigger value="live" className="text-sm font-medium">Live Classes</TabsTrigger>
              <TabsTrigger value="classes" className="text-sm font-medium">Classes</TabsTrigger>
              <TabsTrigger value="timetable" className="text-sm font-medium">Timetable</TabsTrigger>
              <TabsTrigger value="store" className="text-sm font-medium">Store</TabsTrigger>
              <TabsTrigger value="announcements" className="text-sm font-medium">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <CourseManager />
            </TabsContent>

            <TabsContent value="live" className="mt-6">
              <LiveClassAdmin />
            </TabsContent>

            <TabsContent value="classes" className="mt-6">
              <ClassManager />
            </TabsContent>

            <TabsContent value="timetable" className="mt-6">
              <TimetableManager />
            </TabsContent>

            <TabsContent value="store" className="mt-6">
              <StoreManager />
            </TabsContent>

            <TabsContent value="announcements" className="mt-6">
              <AnnouncementManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Website Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <WebsiteSettingsManager />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <NavigationManager />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Website Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <WebsiteTemplateManager />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Content Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentEditor />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Banner Management</CardTitle>
        </CardHeader>
        <CardContent>
          <BannerManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManager;
