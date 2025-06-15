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
  AlertCircle,
  Wand
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AgoraVideoCallProps {
  appId: string;
  channelName: string;
  token?: string;
  isTeacher?: boolean;
  onLeave: () => void;
  uid?: string | null;
  onTeacherLeave?: () => void; // New prop to handle teacher leaving
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
  onLeave,
  uid: localUid = null,
  onTeacherLeave
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
  const [connectionStatus, setConnectionStatus] = useState<string>('Initializing...');

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Check and request permissions
  const checkPermissions = async () => {
    try {
      setIsCheckingPermissions(true);
      setConnectionStatus('Checking permissions...');
      
      // Check if permissions are already granted
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      console.log('Camera permission:', cameraPermission.state);
      console.log('Microphone permission:', micPermission.state);
      
      if (cameraPermission.state === 'granted' && micPermission.state === 'granted') {
        setPermissionsGranted(true);
        setConnectionStatus('Permissions granted');
        setIsCheckingPermissions(false);
        return;
      }
      
      setConnectionStatus('Permissions needed');
      setIsCheckingPermissions(false);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setConnectionStatus('Permission check failed');
      setIsCheckingPermissions(false);
    }
  };

  const requestPermissions = async () => {
    try {
      setError(null);
      setConnectionStatus('Requesting permissions...');
      
      // Request access to camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      console.log('✅ Media stream obtained:', stream);
      
      // Stop the stream as we'll create proper tracks later
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      
      setPermissionsGranted(true);
      setConnectionStatus('Permissions granted');
    } catch (error) {
      console.error('❌ Permission denied:', error);
      setError('Camera and microphone access is required for video calls. Please allow access and try again.');
      setConnectionStatus('Permission denied');
    }
  };

  // Improved video playing function
  const playVideoTrack = (track: ICameraVideoTrack | IRemoteVideoTrack, container: HTMLDivElement, uid?: string) => {
    if (!track || !container) {
      console.log('❌ Missing track or container for video play');
      return;
    }

    try {
      console.log(`🎥 Playing video track for ${uid || 'local user'}`);
      
      // Clear any existing content
      container.innerHTML = '';
      
      // Play the track
      track.play(container);
      
      console.log(`✅ Video track played successfully for ${uid || 'local user'}`);
    } catch (error) {
      console.error(`❌ Error playing video track for ${uid || 'local user'}:`, error);
    }
  };

  // Initialize Agora client
  useEffect(() => {
    if (!permissionsGranted) return;

    console.log('🔧 Initializing Agora client...');
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);
    setConnectionStatus('Client initialized');

    // Set up event listeners
    agoraClient.on('user-published', async (user, mediaType) => {
      console.log('👤 User published:', user.uid, mediaType);
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

      // Play remote video immediately if it's a video track
      if (mediaType === 'video' && user.videoTrack) {
        const container = remoteVideoRefs.current[user.uid.toString()];
        if (container) {
          playVideoTrack(user.videoTrack, container, user.uid.toString());
        }
      }
    });

    agoraClient.on('user-unpublished', (user, mediaType) => {
      console.log('👤 User unpublished:', user.uid, mediaType);
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
      console.log('👤 User left:', user.uid);
      delete remoteVideoRefs.current[user.uid.toString()];
      
      // Only track remote user leaving, don't trigger teacher leave here
      // Teacher leave should only be triggered when the local teacher actually leaves
      console.log('👤 Remote user left, updating user list');
      
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

  // Play local video when track is available and channel is joined
  useEffect(() => {
    if (isJoined && localVideoTrack && localVideoRef.current) {
      console.log('🎥 Playing local video track as we are joined and have the track.');
      playVideoTrack(localVideoTrack, localVideoRef.current, 'local');
    }
  }, [localVideoTrack, isJoined]);

  // Play remote videos when users change
  useEffect(() => {
    console.log('👥 Remote users updated:', remoteUsers.length, 'users');
    remoteUsers.forEach(user => {
      if (user.videoTrack) {
        const container = remoteVideoRefs.current[user.uid];
        if (container) {
          console.log(`🎥 Playing remote video for user: ${user.uid}`);
          playVideoTrack(user.videoTrack, container, user.uid);
        }
      }
    });
  }, [remoteUsers]);

  const joinChannel = async () => {
    if (!client || !permissionsGranted) {
      console.error('❌ Cannot join: client or permissions not ready');
      return;
    }

    try {
      setError(null);
      setConnectionStatus('Creating video tracks...');
      console.log('🔧 Creating local tracks...');
      
      // Create local tracks with explicit constraints
      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: "480p_1"
      });
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      
      console.log('✅ Local tracks created:', { 
        video: videoTrack ? 'success' : 'failed',
        audio: audioTrack ? 'success' : 'failed'
      });
      
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);
      setConnectionStatus('Joining channel...');

      // Join the channel
      console.log('🔗 Joining channel:', channelName, 'with UID:', localUid);
      const uid = await client.join(appId, channelName, token, localUid);
      console.log('✅ Joined channel with UID:', uid);
      setConnectionStatus(`Connected (UID: ${uid})`);

      // Publish local tracks
      console.log('📡 Publishing local tracks...');
      await client.publish([videoTrack, audioTrack]);
      console.log('✅ Local tracks published successfully');
      
      setIsJoined(true);
      setConnectionStatus('Live and connected');
    } catch (error) {
      console.error('❌ Failed to join channel:', error);
      setError('Failed to join the live class. Please try again.');
      setConnectionStatus('Connection failed');
    }
  };

  const leaveChannel = async () => {
    if (!client) return;

    try {
      console.log('🚪 Leaving channel...');
      setConnectionStatus('Disconnecting...');
      
      // Only trigger teacher leave callback if this is actually a teacher leaving
      if (isTeacher && onTeacherLeave) {
        console.log('🎓 Local teacher is leaving, triggering class end');
        onTeacherLeave();
      }
      
      // Stop and close local tracks
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        console.log('🎥 Local video track stopped');
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        console.log('🎤 Local audio track stopped');
      }

      // Leave the channel
      await client.leave();
      console.log('✅ Left channel successfully');
      
      setIsJoined(false);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setRemoteUsers([]);
      remoteVideoRefs.current = {};
      setConnectionStatus('Disconnected');
      
      onLeave();
    } catch (error) {
      console.error('❌ Failed to leave channel:', error);
      setConnectionStatus('Disconnect failed');
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      console.log('🎥 Toggling video from', isVideoEnabled, 'to', !isVideoEnabled);
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
      console.log('✅ Video toggled successfully');
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      console.log('🎤 Toggling audio from', isAudioEnabled, 'to', !isAudioEnabled);
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
      console.log('✅ Audio toggled successfully');
    }
  };

  if (isCheckingPermissions) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Checking camera and microphone permissions...</p>
            <p className="text-sm text-muted-foreground mt-2">{connectionStatus}</p>
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
              <p className="text-sm text-muted-foreground mt-2">{connectionStatus}</p>
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
              <p className="text-sm text-muted-foreground mt-1">{connectionStatus}</p>
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

  const remoteTeacher = remoteUsers.find(u => u.uid.startsWith('teacher-'));
  const isLocalUserMain = isTeacher || !remoteTeacher;

  const mainParticipant = isLocalUserMain
    ? { isLocal: true, uid: localUid || 'local', videoTrack: localVideoTrack, isVideoEnabled, isAudioEnabled, isTeacher }
    : {
        isLocal: false,
        ...(remoteTeacher!),
        isVideoEnabled: !!remoteTeacher!.videoTrack,
        isAudioEnabled: !!remoteTeacher!.audioTrack,
        isTeacher: true
      };

  const thumbnailParticipants = isLocalUserMain
    ? remoteUsers.map(u => ({
        isLocal: false,
        ...u,
        isTeacher: u.uid.startsWith('teacher-'),
        isVideoEnabled: !!u.videoTrack,
        isAudioEnabled: !!u.audioTrack,
      }))
    : [
        { isLocal: true, uid: localUid || 'local', videoTrack: localVideoTrack, isVideoEnabled, isAudioEnabled, isTeacher },
        ...remoteUsers
          .filter(u => u.uid !== remoteTeacher?.uid)
          .map(u => ({
            isLocal: false,
            ...u,
            isTeacher: u.uid.startsWith('teacher-'),
            isVideoEnabled: !!u.videoTrack,
            isAudioEnabled: !!u.audioTrack,
          })),
      ];

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
          <h1 className="text-base sm:text-lg font-semibold whitespace-nowrap">Live Class: {channelName.split('-').pop()}</h1>
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <Users className="h-4 w-4" />
            <span>{remoteUsers.length + 1} participants</span>
          </div>
          {isTeacher && (
            <span className="bg-blue-600 px-2 py-1 rounded text-xs">Teacher</span>
          )}
          <span className="text-xs bg-green-600 px-2 py-1 rounded">{connectionStatus}</span>
        </div>
        
        <div className="flex items-center space-x-2 shrink-0">
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

      {/* Video Area */}
      <div className="flex-1 p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 overflow-hidden">
        {/* Main Pinned Video */}
        <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500 min-h-0">
          <div 
            ref={mainParticipant.isLocal ? localVideoRef : (el) => { if(mainParticipant.uid) remoteVideoRefs.current[mainParticipant.uid] = el; }}
            className="w-full h-full bg-black"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-2">
            {mainParticipant.isLocal ? 'You' : `User ${mainParticipant.uid.split('-').pop()}`}
            <div className="flex items-center gap-1 text-yellow-400">
              {mainParticipant.isTeacher ? '(Teacher)' : '(Student)'}
              {!mainParticipant.isTeacher && <Wand className="h-4 w-4" />}
            </div>
          </div>
          <div className="absolute top-2 right-2 flex space-x-1">
            {!mainParticipant.isVideoEnabled && (
              <div className="bg-red-600 p-1 rounded"><VideoOff className="h-3 w-3 text-white" /></div>
            )}
            {!mainParticipant.isAudioEnabled && (
              <div className="bg-red-600 p-1 rounded"><MicOff className="h-3 w-3 text-white" /></div>
            )}
          </div>
          {(!mainParticipant.videoTrack || !mainParticipant.isVideoEnabled) && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {thumbnailParticipants.length > 0 && (
          <div className="h-24 sm:h-32 md:h-40">
            <div className="h-full flex gap-2 sm:gap-4 overflow-x-auto pb-2">
              {thumbnailParticipants.map((user) => (
                <div key={user.uid} className="h-full aspect-video flex-shrink-0 relative bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                  <div 
                    ref={user.isLocal ? localVideoRef : (el) => { if(user.uid) remoteVideoRefs.current[user.uid] = el; }}
                    className="w-full h-full bg-black"
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                    {user.isLocal ? 'You' : `User ${user.uid.split('-').pop()}`}
                     <div className="flex items-center gap-1 text-yellow-300">
                      {user.isTeacher ? '(T)' : '(S)'}
                      {!user.isTeacher && <Wand className="h-3 w-3" />}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {!user.isVideoEnabled && (
                      <div className="bg-red-600 p-1 rounded"><VideoOff className="h-3 w-3 text-white" /></div>
                    )}
                    {!user.isAudioEnabled && (
                      <div className="bg-red-600 p-1 rounded"><MicOff className="h-3 w-3 text-white" /></div>
                    )}
                  </div>
                  {!user.isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {remoteUsers.length === 0 && !isTeacher && (
          <div className="h-24 sm:h-32 md:h-40 flex items-center justify-center text-gray-400">
            Waiting for the teacher to join...
          </div>
        )}
      </div>
      
      {/* Debug info at bottom */}
      <div className="bg-gray-800 text-white p-2 text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span>Channel: {channelName}</span>
          <span>UID: {localUid}</span>
          <span>Video: {isVideoEnabled ? 'On' : 'Off'} | Audio: {isAudioEnabled ? 'On' : 'Off'}</span>
          <span>Status: {connectionStatus}</span>
        </div>
      </div>
    </div>
  );
};

export default AgoraVideoCall;
