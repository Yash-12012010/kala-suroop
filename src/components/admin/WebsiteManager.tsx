
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BannerManager from './BannerManager';
import NavigationManager from './NavigationManager';
import WebsiteSettingsManager from './WebsiteSettingsManager';
import PageContentManager from './PageContentManager';
import AnnouncementManager from './AnnouncementManager';

const WebsiteManager = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Website Management
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Complete control over your website content and appearance
        </p>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-6">
          <BannerManager />
        </TabsContent>

        <TabsContent value="navigation" className="mt-6">
          <NavigationManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <WebsiteSettingsManager />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <PageContentManager />
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteManager;
