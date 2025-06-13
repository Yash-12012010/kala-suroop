
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraRTC, { 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng';
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
  
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [isHandRaised, setIsHandRaised] = useState(false);

  useEffect(() => {
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers => [...prevUsers.filter(u => u.uid !== user.uid), user]);
      }
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
    };

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      setParticipantCount(prev => prev + 1);
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      setParticipantCount(prev => Math.max(0, prev - 1));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  const joinChannel = async () => {
    try {
      const uid = await client.join(appId, channelName, token, user?.id || 'guest');
      
      if (isTeacher) {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        
        setLocalVideoTrack(videoTrack);
        setLocalAudioTrack(audioTrack);
        
        await client.publish([videoTrack, audioTrack]);
      } else {
        // Students join with audio only by default
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);
      }
      
      setIsJoined(true);
      setParticipantCount(1);
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  const leaveChannel = async () => {
    try {
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      
      await client.leave();
      setIsJoined(false);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setRemoteUsers([]);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const toggleVideo = async () => {
    if (!isTeacher && !localVideoTrack) {
      // Allow students to turn on video if they want
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);
      await client.publish([videoTrack]);
      setIsVideoEnabled(true);
    } else if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    // In a real implementation, you'd send this to other participants
  };

  useEffect(() => {
    if (localVideoTrack) {
      localVideoTrack.play('local-video');
    }
    
    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
    };
  }, [localVideoTrack]);

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
          {/* Local Video */}
          {localVideoTrack && (
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <div id="local-video" className="w-full h-full" />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                You {isTeacher ? '(Teacher)' : '(Student)'}
              </div>
            </div>
          )}
          
          {/* Remote Videos */}
          {remoteUsers.map((user) => (
            <RemoteUser key={user.uid} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RemoteUser: React.FC<{ user: IAgoraRTCRemoteUser }> = ({ user }) => {
  useEffect(() => {
    if (user.videoTrack) {
      user.videoTrack.play(`remote-video-${user.uid}`);
    }
    
    return () => {
      if (user.videoTrack) {
        user.videoTrack.stop();
      }
    };
  }, [user]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      {user.videoTrack ? (
        <div id={`remote-video-${user.uid}`} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-2" />
            <p>No Video</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        User {user.uid}
      </div>
    </div>
  );
};

export default LiveClass;
