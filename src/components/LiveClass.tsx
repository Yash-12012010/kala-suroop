
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraVideoCall from './AgoraVideoCall';

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
    />
  );
};

export default LiveClass;
