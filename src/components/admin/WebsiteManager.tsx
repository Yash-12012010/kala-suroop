
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BannerManager from './BannerManager';
import NavigationManager from './NavigationManager';
import WebsiteSettingsManager from './WebsiteSettingsManager';
import PageContentManager from './PageContentManager';
import AnnouncementManager from './AnnouncementManager';
import WebsiteTemplateManager from './WebsiteTemplateManager';

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

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <PageContentManager />
        </TabsContent>

        <TabsContent value="banners" className="mt-6">
          <BannerManager />
        </TabsContent>

        <TabsContent value="navigation" className="mt-6">
          <NavigationManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <WebsiteSettingsManager />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <WebsiteTemplateManager />
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteManager;
