
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
      <div className="pt-20 pb-16 flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage classes, subjects, and topics
          </p>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="mt-6">
            <ClassManager />
          </TabsContent>

          <TabsContent value="subjects" className="mt-6">
            <SubjectManager />
          </TabsContent>

          <TabsContent value="topics" className="mt-6">
            <TopicManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminManagement;
