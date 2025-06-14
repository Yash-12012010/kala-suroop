
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ClassManager from '@/components/admin/ClassManager';
import SubjectManager from '@/components/admin/SubjectManager';
import TopicManager from '@/components/admin/TopicManager';

const AdminManagement = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="pt-20 pb-16 flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-center text-muted-foreground">
              Access denied. Admin privileges required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-4">
            Admin Management
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
            Manage classes, subjects, and topics
          </p>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 lg:mb-6">
            <TabsTrigger value="classes" className="text-sm lg:text-base">Classes</TabsTrigger>
            <TabsTrigger value="subjects" className="text-sm lg:text-base">Subjects</TabsTrigger>
            <TabsTrigger value="topics" className="text-sm lg:text-base">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="mt-4 lg:mt-6">
            <ClassManager />
          </TabsContent>

          <TabsContent value="subjects" className="mt-4 lg:mt-6">
            <SubjectManager />
          </TabsContent>

          <TabsContent value="topics" className="mt-4 lg:mt-6">
            <TopicManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminManagement;
