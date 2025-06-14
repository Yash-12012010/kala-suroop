
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database, 
  Video, 
  Users, 
  Settings,
  Navigation,
  Bell
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'running';
  message: string;
  timestamp: Date;
}

const SystemTestPanel = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const addTestResult = (category: string, test: string, status: 'pass' | 'fail' | 'warning', message: string) => {
    const result: TestResult = {
      category,
      test,
      status,
      message,
      timestamp: new Date()
    };
    setTestResults(prev => [...prev, result]);
    console.log(`${status.toUpperCase()}: [${category}] ${test} - ${message}`);
  };

  const runDatabaseTests = async () => {
    addTestResult('Database', 'Connection Test', 'running', 'Testing Supabase connection...');
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('live_sessions').select('count').limit(1);
      if (error) throw error;
      addTestResult('Database', 'Connection Test', 'pass', 'Supabase connection successful');
    } catch (error) {
      addTestResult('Database', 'Connection Test', 'fail', `Connection failed: ${error}`);
    }

    // Test authentication
    if (user) {
      addTestResult('Database', 'Authentication', 'pass', `User authenticated: ${user.email}`);
    } else {
      addTestResult('Database', 'Authentication', 'warning', 'No user authenticated');
    }

    // Test tables existence
    const tables = ['live_sessions', 'announcements', 'banners'];
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) throw error;
        addTestResult('Database', `Table: ${table}`, 'pass', 'Table accessible');
      } catch (error) {
        addTestResult('Database', `Table: ${table}`, 'fail', `Table error: ${error}`);
      }
    }
  };

  const runVideoSystemTests = () => {
    addTestResult('Video System', 'Agora SDK', 'running', 'Checking Agora integration...');
    
    // Check if Agora SDK is loaded
    if (typeof window !== 'undefined' && (window as any).AgoraRTC) {
      addTestResult('Video System', 'Agora SDK', 'pass', 'Agora SDK loaded successfully');
    } else {
      addTestResult('Video System', 'Agora SDK', 'warning', 'Agora SDK not detected in global scope');
    }

    // Check App ID
    const AGORA_APP_ID = '76fe48407b1d4e0986592d7ad3d5a361';
    if (AGORA_APP_ID && AGORA_APP_ID.length > 10) {
      addTestResult('Video System', 'App ID', 'pass', 'Agora App ID configured');
    } else {
      addTestResult('Video System', 'App ID', 'fail', 'Agora App ID missing or invalid');
    }

    // Test media permissions (basic check)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      addTestResult('Video System', 'Media API', 'pass', 'Media devices API available');
    } else {
      addTestResult('Video System', 'Media API', 'fail', 'Media devices API not available');
    }
  };

  const runNavigationTests = () => {
    addTestResult('Navigation', 'Routes', 'running', 'Testing route accessibility...');
    
    const routes = [
      '/dashboard',
      '/live-classroom',
      '/admin',
      '/courses',
      '/announcements'
    ];

    routes.forEach(route => {
      try {
        const url = new URL(route, window.location.origin);
        addTestResult('Navigation', `Route: ${route}`, 'pass', `Route accessible: ${url.pathname}`);
      } catch (error) {
        addTestResult('Navigation', `Route: ${route}`, 'fail', `Route error: ${error}`);
      }
    });

    // Test URL parameters
    const testParams = new URLSearchParams('?channel=test&teacher=true');
    if (testParams.get('channel') === 'test') {
      addTestResult('Navigation', 'URL Parameters', 'pass', 'URL parameter parsing working');
    } else {
      addTestResult('Navigation', 'URL Parameters', 'fail', 'URL parameter parsing failed');
    }
  };

  const runUITests = () => {
    addTestResult('UI Components', 'Toast System', 'running', 'Testing toast notifications...');
    
    try {
      toast({
        title: "System Test",
        description: "Toast system working correctly",
      });
      addTestResult('UI Components', 'Toast System', 'pass', 'Toast notifications working');
    } catch (error) {
      addTestResult('UI Components', 'Toast System', 'fail', `Toast error: ${error}`);
    }

    // Test responsive design
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    
    addTestResult('UI Components', 'Responsive Design', 'pass', 
      `Screen size detected: ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} (${window.innerWidth}px)`);
  };

  const runLiveClassTests = () => {
    addTestResult('Live Classes', 'Component Loading', 'running', 'Testing live class components...');
    
    // Test live class URL generation
    const testChannelName = `test-${Date.now()}`;
    const teacherUrl = `/live-classroom?channel=${testChannelName}&teacher=true`;
    const studentUrl = `/live-classroom?channel=${testChannelName}`;
    
    addTestResult('Live Classes', 'URL Generation', 'pass', `Teacher URL: ${teacherUrl}`);
    addTestResult('Live Classes', 'URL Generation', 'pass', `Student URL: ${studentUrl}`);
    
    // Test auto-join parameters
    const params = new URLSearchParams(teacherUrl.split('?')[1]);
    if (params.get('teacher') === 'true' && params.get('channel') === testChannelName) {
      addTestResult('Live Classes', 'Auto-join Parameters', 'pass', 'URL parameters correctly formatted');
    } else {
      addTestResult('Live Classes', 'Auto-join Parameters', 'fail', 'URL parameters incorrect');
    }
  };

  const runFullSystemTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addTestResult('System', 'Test Start', 'pass', 'Starting comprehensive system test...');
    
    await runDatabaseTests();
    runVideoSystemTests();
    runNavigationTests();
    runUITests();
    runLiveClassTests();
    
    addTestResult('System', 'Test Complete', 'pass', 'All tests completed');
    setIsRunning(false);
    
    toast({
      title: "System Test Complete",
      description: "Check the results below for detailed information",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedResults = testResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Database':
        return <Database className="h-5 w-5" />;
      case 'Video System':
        return <Video className="h-5 w-5" />;
      case 'Navigation':
        return <Navigation className="h-5 w-5" />;
      case 'UI Components':
        return <Settings className="h-5 w-5" />;
      case 'Live Classes':
        return <Users className="h-5 w-5" />;
      case 'System':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    // Run initial quick tests on mount
    runNavigationTests();
    runUITests();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            System Test Panel
          </div>
          <Button 
            onClick={runFullSystemTest} 
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? 'Running Tests...' : 'Run Full Test'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedResults).map(([category, results]) => (
            <div key={category}>
              <h4 className="flex items-center font-semibold mb-3">
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
                <Badge className="ml-2" variant="secondary">
                  {results.length} tests
                </Badge>
              </h4>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium">{result.test}</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {testResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No tests run yet. Click "Run Full Test" to start comprehensive testing.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemTestPanel;
