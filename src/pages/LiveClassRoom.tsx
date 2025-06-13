
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Users, Clock } from 'lucide-react';
import LiveClass from '@/components/LiveClass';
import { useAuth } from '@/contexts/AuthContext';

const LiveClassRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showLiveClass, setShowLiveClass] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  
  // This should come from environment variables in a real app
  const AGORA_APP_ID = 'your-agora-app-id'; // You'll need to set this

  const handleJoinClass = (channel: string, asTeacher: boolean = false) => {
    setChannelName(channel);
    setIsTeacher(asTeacher);
    setShowLiveClass(true);
  };

  if (showLiveClass && AGORA_APP_ID !== 'your-agora-app-id') {
    return (
      <LiveClass 
        channelName={channelName}
        appId={AGORA_APP_ID}
        isTeacher={isTeacher}
      />
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live Classes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join ongoing classes or start a new session
          </p>
        </div>

        {AGORA_APP_ID === 'your-agora-app-id' ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-red-600">Setup Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>To enable live classes, you need to:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Sign up for a free account at <a href="https://www.agora.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Agora.io</a></li>
                  <li>Create a new project in your Agora dashboard</li>
                  <li>Get your App ID from the project settings</li>
                  <li>Add your App ID to the Supabase secrets as 'AGORA_APP_ID'</li>
                </ol>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> For production use, you'll also need to implement token generation for security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Join Existing Class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Join a Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-channel">Class Channel Name</Label>
                <Input 
                  id="join-channel"
                  placeholder="Enter channel name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleJoinClass(channelName, false)}
                disabled={!channelName.trim() || AGORA_APP_ID === 'your-agora-app-id'}
                className="w-full"
              >
                Join as Student
              </Button>
            </CardContent>
          </Card>

          {/* Start New Class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Start a Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-channel">New Class Channel Name</Label>
                <Input 
                  id="start-channel"
                  placeholder="Enter channel name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleJoinClass(channelName, true)}
                disabled={!channelName.trim() || AGORA_APP_ID === 'your-agora-app-id'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start as Teacher
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Classes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Scheduled Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample scheduled classes */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Mathematics - Algebra</h3>
                  <p className="text-sm text-muted-foreground">Today, 3:00 PM</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>Live</Badge>
                  <Button 
                    size="sm" 
                    onClick={() => handleJoinClass('math-algebra-001', false)}
                    disabled={AGORA_APP_ID === 'your-agora-app-id'}
                  >
                    Join
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Physics - Mechanics</h3>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Scheduled</Badge>
                  <Button size="sm" variant="outline" disabled>
                    Not Started
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveClassRoom;
