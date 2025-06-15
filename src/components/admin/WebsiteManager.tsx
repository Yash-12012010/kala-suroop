
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BannerManager from './BannerManager';
import NavigationManager from './NavigationManager';
import WebsiteSettingsManager from './WebsiteSettingsManager';
import PageContentManager from './PageContentManager';
import AnnouncementManager from './AnnouncementManager';
import LiveClassAdmin from './LiveClassAdmin';
import QuickEditPanel from './QuickEditPanel';
import CourseManager from './CourseManager';
import StoreManager from './StoreManager';
import ClassManager from './ClassManager';
import SubjectManager from './SubjectManager';
import TimetableManager from './TimetableManager';

const WebsiteManager = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Website Management Console
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Complete control over your website content, design, and functionality
        </p>
      </div>

      <Tabs defaultValue="quick-create" className="w-full">
        <div className="space-y-2">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quick-create">Quick Create</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="live-classes">Live Classes</TabsTrigger>
            <TabsTrigger value=""><!-- Empty slot --></TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="quick-create" className="mt-6">
          <QuickEditPanel />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <PageContentManager />
        </TabsContent>

        <TabsContent value="banners" className="mt-6">
          <BannerManager />
        </TabsContent>

        <TabsContent value="navigation" className="mt-6">
          <NavigationManager />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <CourseManager />
        </TabsContent>

        <TabsContent value="store" className="mt-6">
          <StoreManager />
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <TimetableManager />
        </TabsContent>

        <TabsContent value="classes" className="mt-6">
          <ClassManager />
        </TabsContent>

        <TabsContent value="subjects" className="mt-6">
          <SubjectManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <WebsiteSettingsManager />
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementManager />
        </TabsContent>

        <TabsContent value="live-classes" className="mt-6">
          <LiveClassAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteManager;
