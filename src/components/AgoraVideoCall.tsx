
import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Users,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AgoraVideoCallProps {
  appId: string;
  channelName: string;
  token?: string;
  isTeacher?: boolean;
  onLeave: () => void;
}

interface RemoteUser {
  uid: string;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
}

const AgoraVideoCall: React.FC<AgoraVideoCallProps> = ({
  appId,
  channelName,
  token = null,
  isTeacher = false,
  onLeave
}) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);

  const localVideoRef = useRef<HTMLDivElement>(null);

  // Check and request permissions
  const checkPermissions = async () => {
    try {
      setIsCheckingPermissions(true);
      
      // Check if permissions are already granted
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (cameraPermission.state === 'granted' && micPermission.state === 'granted') {
        setPermissionsGranted(true);
        setIsCheckingPermissions(false);
        return;
      }
      
      setIsCheckingPermissions(false);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setIsCheckingPermissions(false);
    }
  };

  const requestPermissions = async () => {
    try {
      setError(null);
      
      // Request access to camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Stop the stream as we'll create proper tracks later
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionsGranted(true);
    } catch (error) {
      console.error('Permission denied:', error);
      setError('Camera and microphone access is required for video calls. Please allow access and try again.');
    }
  };

  // Initialize Agora client
  useEffect(() => {
    if (!permissionsGranted) return;

    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);

    // Set up event listeners
    agoraClient.on('user-published', async (user, mediaType) => {
      console.log('User published:', user.uid, mediaType);
      await agoraClient.subscribe(user, mediaType);
      
      setRemoteUsers(prevUsers => {
        const existingUser = prevUsers.find(u => u.uid === user.uid.toString());
        if (existingUser) {
          return prevUsers.map(u => 
            u.uid === user.uid.toString() 
              ? {
                  ...u,
                  videoTrack: mediaType === 'video' ? user.videoTrack : u.videoTrack,
                  audioTrack: mediaType === 'audio' ? user.audioTrack : u.audioTrack
                }
              : u
          );
        } else {
          return [...prevUsers, {
            uid: user.uid.toString(),
            videoTrack: mediaType === 'video' ? user.videoTrack : undefined,
            audioTrack: mediaType === 'audio' ? user.audioTrack : undefined
          }];
        }
      });

      // Play remote video immediately
      if (mediaType === 'video' && user.videoTrack) {
        setTimeout(() => {
          const remoteVideoContainer = document.getElementById(`remote-video-${user.uid}`);
          if (remoteVideoContainer) {
            console.log('Playing remote video for user:', user.uid);
            user.videoTrack.play(remoteVideoContainer);
          }
        }, 100);
      }
    });

    agoraClient.on('user-unpublished', (user, mediaType) => {
      console.log('User unpublished:', user.uid, mediaType);
      setRemoteUsers(prevUsers => 
        prevUsers.map(u => 
          u.uid === user.uid.toString()
            ? {
                ...u,
                videoTrack: mediaType === 'video' ? undefined : u.videoTrack,
                audioTrack: mediaType === 'audio' ? undefined : u.audioTrack
              }
            : u
        )
      );
    });

    agoraClient.on('user-left', (user) => {
      console.log('User left:', user.uid);
      setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid.toString()));
    });

    return () => {
      agoraClient.removeAllListeners();
    };
  }, [permissionsGranted]);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  // Play local video when track is available
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      console.log('Playing local video track');
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  const joinChannel = async () => {
    if (!client || !permissionsGranted) return;

    try {
      setError(null);
      console.log('Creating local tracks...');
      
      // Create local tracks
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      
      console.log('Local tracks created:', { videoTrack, audioTrack });
      
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);

      // Join the channel
      console.log('Joining channel:', channelName);
      const uid = await client.join(appId, channelName, token, null);
      console.log('Joined channel with UID:', uid);

      // Publish local tracks
      console.log('Publishing local tracks...');
      await client.publish([videoTrack, audioTrack]);
      console.log('Local tracks published successfully');
      
      setIsJoined(true);
    } catch (error) {
      console.error('Failed to join channel:', error);
      setError('Failed to join the live class. Please try again.');
    }
  };

  const leaveChannel = async () => {
    if (!client) return;

    try {
      console.log('Leaving channel...');
      
      // Stop and close local tracks
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }

      // Leave the channel
      await client.leave();
      console.log('Left channel successfully');
      
      setIsJoined(false);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setRemoteUsers([]);
      
      onLeave();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      console.log('Toggling video from', isVideoEnabled, 'to', !isVideoEnabled);
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      console.log('Toggling audio from', isAudioEnabled, 'to', !isAudioEnabled);
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Render remote videos when users change
  useEffect(() => {
    console.log('Remote users updated:', remoteUsers);
    remoteUsers.forEach(user => {
      if (user.videoTrack) {
        setTimeout(() => {
          const container = document.getElementById(`remote-video-${user.uid}`);
          if (container) {
            console.log('Playing remote video for user:', user.uid);
            user.videoTrack.play(container);
          }
        }, 100);
      }
    });
  }, [remoteUsers]);

  if (isCheckingPermissions) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Checking camera and microphone permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!permissionsGranted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Video className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Camera & Microphone Access Required</h3>
              <p className="text-muted-foreground">
                To join the live class, please allow access to your camera and microphone.
              </p>
            </div>
            
            {error && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Button onClick={requestPermissions} className="w-full">
                Allow Camera & Microphone
              </Button>
              <Button onClick={onLeave} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">Join Live Class</h3>
              <p className="text-muted-foreground">
                Channel: <strong>{channelName}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Role: {isTeacher ? 'Teacher' : 'Student'}
              </p>
            </div>
            
            {error && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Button onClick={joinChannel} className="w-full">
                Join Class
              </Button>
              <Button onClick={onLeave} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Live Class: {channelName}</h1>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{remoteUsers.length + 1} participants</span>
          </div>
          {isTeacher && (
            <span className="bg-blue-600 px-2 py-1 rounded text-xs">Teacher</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className={isAudioEnabled ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'bg-red-600 hover:bg-red-700 text-white border-red-600'}
          >
            {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVideo}
            className={isVideoEnabled ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'bg-red-600 hover:bg-red-700 text-white border-red-600'}
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={leaveChannel}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className={`h-full grid gap-4 ${remoteUsers.length === 0 ? 'grid-cols-1' : remoteUsers.length === 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div 
              ref={localVideoRef}
              className="w-full h-full min-h-[200px]"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You {isTeacher ? '(Teacher)' : '(Student)'}
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Remote Videos */}
          {remoteUsers.map((user) => (
            <div key={user.uid} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <div 
                id={`remote-video-${user.uid}`}
                className="w-full h-full min-h-[200px]"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                User {user.uid}
              </div>
              {!user.videoTrack && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgoraVideoCall;
