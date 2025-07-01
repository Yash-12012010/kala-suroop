
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AgoraVideoCall from './AgoraVideoCall';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LiveClassProps {
  channelName: string;
  appId: string;
  token?: string | null;
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
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const handleLeave = () => {
    navigate('/dashboard');
  };

  const handleTeacherLeave = async () => {
    try {
      console.log('🎓 Teacher left, ending live session for channel:', channelName);
      
      // Find and end the live session
      const { data: sessions, error: fetchError } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('agora_channel', channelName)
        .not('agora_channel', 'is', null);

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        return;
      }

      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        
        // End the session
        const { error: updateError } = await supabase
          .from('live_sessions')
          .update({
            agora_channel: null,
            scheduled_end: new Date().toISOString()
          })
          .eq('id', session.id);

        if (updateError) {
          console.error('Error ending session:', updateError);
        } else {
          console.log('✅ Session ended successfully');
          
          // Create an announcement about the class ending
          try {
            await supabase
              .from('announcements')
              .insert({
                title: `Class Ended: ${session.title}`,
                content: `${session.title} has ended because the teacher left the session.`,
                type: 'info',
                target_audience: 'all',
                is_active: true,
                is_pinned: false
              });
          } catch (announcementError) {
            console.error('Error creating end announcement:', announcementError);
          }

          toast({
            title: "Class Ended",
            description: "The class has ended because the teacher left.",
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error('Error handling teacher leave:', error);
    }
  };

  return (
    <AgoraVideoCall
      appId={appId}
      channelName={channelName}
      token={token || undefined}
      isTeacher={isTeacher}
      onLeave={handleLeave}
      uid={uid}
      onTeacherLeave={handleTeacherLeave}
    />
  );
};

export default LiveClass;
