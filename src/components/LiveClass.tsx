
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Users,
  MessageCircle,
  Hand
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LiveClassProps {
  channelName: string;
  appId: string;
  token?: string;
  isTeacher?: boolean;
}

const LiveClass: React.FC<LiveClassProps> = ({ 
  channelName, 
  appId, 
  token = null,
  isTeacher = false 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Simulate joining a channel
  const joinChannel = async () => {
    try {
      console.log('Joining channel:', channelName);
      console.log('User role:', isTeacher ? 'Teacher' : 'Student');
      
      // Simulate joining process
      setIsJoined(true);
      setParticipantCount(1);
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  const leaveChannel = async () => {
    try {
      console.log('Leaving channel');
      setIsJoined(false);
      setParticipantCount(0);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const toggleVideo = async () => {
    setIsVideoEnabled(!isVideoEnabled);
    console.log('Video toggled:', !isVideoEnabled);
  };

  const toggleAudio = async () => {
    setIsAudioEnabled(!isAudioEnabled);
    console.log('Audio toggled:', !isAudioEnabled);
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    console.log('Hand raised:', !isHandRaised);
  };

  if (!isJoined) {
    return (
      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Join Live Class</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Channel: {channelName}</h3>
                <p className="text-muted-foreground">
                  You are joining as a {isTeacher ? 'Teacher' : 'Student'}
                </p>
              </div>
              
              <div className="space-y-4">
                <Button onClick={joinChannel} size="lg" className="w-full">
                  Join Class
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Live Class: {channelName}</h1>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{participantCount} participants</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className={isAudioEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVideo}
            className={isVideoEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          {!isTeacher && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleHandRaise}
              className={isHandRaised ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            >
              <Hand className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={leaveChannel}
            className="bg-red-600 hover:bg-red-700"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {/* Local Video Placeholder */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                {isVideoEnabled ? (
                  <Video className="h-12 w-12 mx-auto mb-2" />
                ) : (
                  <VideoOff className="h-12 w-12 mx-auto mb-2" />
                )}
                <p>{isVideoEnabled ? 'Camera On' : 'Camera Off'}</p>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You {isTeacher ? '(Teacher)' : '(Student)'}
            </div>
          </div>
          
          {/* Placeholder for other participants */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p>Waiting for participants...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClass;
