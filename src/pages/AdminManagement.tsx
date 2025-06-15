
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import WebsiteManager from '@/components/admin/WebsiteManager';

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
        <WebsiteManager />
      </div>
    </div>
  );
};

export default AdminManagement;
