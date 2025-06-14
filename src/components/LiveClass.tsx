
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraVideoCall from './AgoraVideoCall';

interface LiveClassProps {
  channelName: string;
  appId: string;
  token?: string;
  isTeacher?: boolean;
  uid: string | null;
}

const LiveClass: React.FC<LiveClassProps> = ({ 
  channelName, 
  appId, 
  token = null,
  isTeacher = false,
  uid = null
}) => {
  const navigate = useNavigate();

  const handleLeave = () => {
    navigate('/dashboard');
  };

  return (
    <AgoraVideoCall
      appId={appId}
      channelName={channelName}
      token={token}
      isTeacher={isTeacher}
      onLeave={handleLeave}
      uid={uid}
    />
  );
};

export default LiveClass;
