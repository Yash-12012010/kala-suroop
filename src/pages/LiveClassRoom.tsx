
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Users, Clock, AlertCircle } from 'lucide-react';
import LiveClass from '@/components/LiveClass';
import { useAuth } from '@/contexts/AuthContext';

const LiveClassRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showLiveClass, setShowLiveClass] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  
  // For demo purposes - in production, this should come from environment variables
  const AGORA_APP_ID = process.env.REACT_APP_AGORA_APP_ID || 'demo-app-id';

  const handleJoinClass = (channel: string, asTeacher: boolean = false) => {
    if (!channel.trim()) {
      alert('Please enter a channel name');
      return;
    }
    
    setChannelName(channel);
    setIsTeacher(asTeacher);
    setShowLiveClass(true);
  };

  if (showLiveClass) {
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

        {/* Setup Instructions */}
        <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
              <AlertCircle className="h-5 w-5 mr-2" />
              Demo Mode Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-orange-700 dark:text-orange-300">
                This is a demo version of the live class feature. To enable full functionality:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700 dark:text-orange-300">
                <li>Sign up for a free account at <a href="https://www.agora.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Agora.io</a></li>
                <li>Create a new project in your Agora dashboard</li>
                <li>Get your App ID from the project settings</li>
                <li>Set the REACT_APP_AGORA_APP_ID environment variable</li>
              </ol>
            </div>
          </CardContent>
        </Card>

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
                  placeholder="Enter channel name (e.g., math-101)"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleJoinClass(channelName, false)}
                disabled={!channelName.trim()}
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
                  placeholder="Create channel name (e.g., physics-201)"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleJoinClass(channelName, true)}
                disabled={!channelName.trim()}
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
