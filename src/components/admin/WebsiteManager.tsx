
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassManager from './ClassManager';
import TopicManager from './TopicManager';
import TimetableManager from './TimetableManager';
import CourseManager from './CourseManager';
import StoreManager from './StoreManager';
import AnnouncementManager from './AnnouncementManager';
import BannerManager from './BannerManager';
import LiveClassAdmin from './LiveClassAdmin';
import LiveContentManager from './LiveContentManager';
import NavigationManager from './NavigationManager';
import WebsiteSettingsManager from './WebsiteSettingsManager';
import WebsiteTemplateManager from './WebsiteTemplateManager';
import ContentEditor from './ContentEditor';
import QuickEditPanel from './QuickEditPanel';

const WebsiteManager = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Website Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="live">Live Classes</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="store">Store</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="banners">Banners</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <CourseManager />
            </TabsContent>

            <TabsContent value="live" className="mt-6">
              <div className="space-y-6">
                <LiveClassAdmin />
                <LiveContentManager />
              </div>
            </TabsContent>

            <TabsContent value="classes" className="mt-6">
              <ClassManager />
            </TabsContent>

            <TabsContent value="topics" className="mt-6">
              <TopicManager />
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

            <TabsContent value="banners" className="mt-6">
              <BannerManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NavigationManager />
        <WebsiteSettingsManager />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WebsiteTemplateManager />
        <ContentEditor />
      </div>

      <QuickEditPanel />
    </div>
  );
};

export default WebsiteManager;
