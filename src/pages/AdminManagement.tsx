
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Megaphone, BookOpen, Store, Clock, Video, Globe, FileText, Navigation } from 'lucide-react';
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
import { useBrowserPopupOverride } from '@/hooks/useBrowserPopupOverride';

const AdminManagement = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  // Get custom popup functions
  const { showAlert, showConfirm, showPrompt } = useBrowserPopupOverride();

  const handleContentSave = async (content: any) => {
    console.log('Saving content:', content);
    
    // Use custom popup instead of browser confirm
    const confirmed = await showConfirm('Are you sure you want to save these changes?', 'Confirm Save');
    
    if (confirmed) {
      toast({
        title: "Success",
        description: "Content saved successfully",
      });
      await showAlert('Content has been saved successfully!', 'Success');
    }
  };

  // Test function to demonstrate popup functionality
  const testCustomPopups = async () => {
    console.log('Testing custom popups...');
    
    // Test alert
    await showAlert('This is a custom alert!', 'Test Alert');
    
    // Test confirm
    const confirmed = await showConfirm('Do you want to continue?', 'Test Confirm');
    console.log('Confirmed:', confirmed);
    
    // Test prompt
    const userInput = await showPrompt('Enter your name:', 'Test Prompt', 'Default Name');
    console.log('User input:', userInput);
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
          
          {/* Test button for custom popups */}
          <button 
            onClick={testCustomPopups}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Test Custom Popups
          </button>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="live-classes" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Live Classes
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Store
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="space-y-6">
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
                  <CourseManager />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Course Enrollments
                  </CardTitle>
                  <CardDescription>
                    Manage student course enrollments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CourseEnrollmentManager />
                </CardContent>
              </Card>

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
            </div>
          </TabsContent>

          <TabsContent value="classes" className="mt-6">
            <div className="space-y-6">
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
            </div>
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
            <div className="space-y-6">
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

              <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Banner Management
                  </CardTitle>
                  <CardDescription>
                    Create and manage website banners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BannerManager />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Navigation Management
                  </CardTitle>
                  <CardDescription>
                    Manage website navigation items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NavigationManager />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Website Settings
                  </CardTitle>
                  <CardDescription>
                    Configure website appearance and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WebsiteSettingsManager />
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Editor
                  </CardTitle>
                  <CardDescription>
                    Edit page content and templates
                  </CardDescription>
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
