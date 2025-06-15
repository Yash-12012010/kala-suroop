
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
import { useToast } from '@/hooks/use-toast';

const WebsiteManager = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const { toast } = useToast();

  const handleContentSave = (content: any) => {
    console.log('Saving content:', content);
    toast({
      title: "Success",
      description: "Content saved successfully",
    });
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 space-y-6 sm:space-y-8 min-h-screen">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 leading-tight">
          Website Administration
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Manage your website content, courses, and settings
        </p>
      </div>

      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full mb-6 sm:mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto min-h-[48px]">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 w-full gap-1">
                <TabsTrigger 
                  value="courses" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Courses
                </TabsTrigger>
                <TabsTrigger 
                  value="live" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Live
                </TabsTrigger>
                <TabsTrigger 
                  value="classes" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Classes
                </TabsTrigger>
                <TabsTrigger 
                  value="timetable" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <span className="hidden sm:inline">Timetable</span>
                  <span className="sm:hidden">Time</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="store" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-yellow-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Store
                </TabsTrigger>
                <TabsTrigger 
                  value="announcements" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <span className="hidden sm:inline">Announcements</span>
                  <span className="sm:hidden">News</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="navigation" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <span className="hidden sm:inline">Navigation</span>
                  <span className="sm:hidden">Nav</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="templates" 
                  className="text-xs sm:text-sm font-medium px-2 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <span className="hidden sm:inline">Templates</span>
                  <span className="sm:hidden">Temp</span>
                </TabsTrigger>
              </div>
            </TabsList>

            <div className="mt-4 sm:mt-6">
              <TabsContent value="courses">
                <CourseManager />
              </TabsContent>

              <TabsContent value="live">
                <LiveClassAdmin />
              </TabsContent>

              <TabsContent value="classes">
                <ClassManager />
              </TabsContent>

              <TabsContent value="timetable">
                <TimetableManager />
              </TabsContent>

              <TabsContent value="store">
                <StoreManager />
              </TabsContent>

              <TabsContent value="announcements">
                <div className="space-y-4 sm:space-y-6">
                  <AnnouncementManager />
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-semibold">Banner Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BannerManager />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="navigation">
                <NavigationManager />
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4 sm:space-y-6">
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-semibold">Website Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WebsiteSettingsManager />
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-semibold">Content Editor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ContentEditor onSave={handleContentSave} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <WebsiteTemplateManager />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManager;
