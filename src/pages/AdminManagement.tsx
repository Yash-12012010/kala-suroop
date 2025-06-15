
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Megaphone, BookOpen, Store, Clock, Video } from 'lucide-react';
import CourseManager from '@/components/admin/CourseManager';
import AnnouncementManager from '@/components/admin/AnnouncementManager';
import StoreManager from '@/components/admin/StoreManager';
import ClassManager from '@/components/admin/ClassManager';
import LiveClassAdmin from '@/components/admin/LiveClassAdmin';
import TimetableManager from '@/components/admin/TimetableManager';
import BannerManager from '@/components/admin/BannerManager';
import NavigationManager from '@/components/admin/NavigationManager';
import WebsiteSettingsManager from '@/components/admin/WebsiteSettingsManager';
import ContentEditor from '@/components/admin/ContentEditor';
import CourseEnrollmentManager from '@/components/admin/CourseEnrollmentManager';
import { useToast } from '@/hooks/use-toast';

const AdminManagement = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  const handleContentSave = (content: any) => {
    console.log('Saving content:', content);
    toast({
      title: "Success",
      description: "Content saved successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your platform's content, courses, and settings
          </p>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timetable
            </TabsTrigger>
            <TabsTrigger value="live-classes" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Live Classes
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Store
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Website
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Management
                </CardTitle>
                <CardDescription>
                  Create, edit, and manage your courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <CourseManager />
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-semibold">Course Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CourseEnrollmentManager />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Class Management
                </CardTitle>
                <CardDescription>
                  Manage class levels and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClassManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetable" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timetable Management
                </CardTitle>
                <CardDescription>
                  Manage class schedules and subject legends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimetableManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live-classes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Live Class Management
                </CardTitle>
                <CardDescription>
                  Schedule and manage live classes with teacher management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LiveClassAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="store" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Management
                </CardTitle>
                <CardDescription>
                  Manage products in your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoreManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="website" className="mt-6">
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Announcement Management
                  </CardTitle>
                  <CardDescription>
                    Create and manage site-wide announcements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnnouncementManager />
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-semibold">Banner Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <BannerManager />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-semibold">Navigation Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <NavigationManager />
                </CardContent>
              </Card>

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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminManagement;
