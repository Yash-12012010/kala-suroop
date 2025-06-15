
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Circle, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RecordingManagerProps {
  sessionId: string;
  courseId: string;
  sessionTitle: string;
  isTeacher?: boolean;
}

const RecordingManager: React.FC<RecordingManagerProps> = ({
  sessionId,
  courseId,
  sessionTitle,
  isTeacher = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    if (!isTeacher) return;

    try {
      setIsRecording(true);
      setRecordingStartTime(new Date());
      
      console.log('🎥 Recording started for session:', sessionId);
      
      toast({
        title: "Recording Started",
        description: "Class recording has begun",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setRecordingStartTime(null);
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive"
      });
    }
  };

  const stopRecording = async () => {
    if (!isTeacher || !recordingStartTime) return;

    try {
      const duration = Math.floor((new Date().getTime() - recordingStartTime.getTime()) / 1000);
      
      // In a real implementation, you would:
      // 1. Stop the actual recording service
      // 2. Get the recording file URL
      // 3. Save to storage and database
      
      // For now, we'll create a mock recording entry
      const mockRecordingUrl = `https://example.com/recordings/${sessionId}-${Date.now()}.mp4`;
      
      const { error } = await supabase
        .from('class_recordings')
        .insert({
          course_id: courseId,
          live_session_id: sessionId,
          title: `${sessionTitle} - Recording`,
          recording_url: mockRecordingUrl,
          duration: duration
        });

      if (error) {
        throw error;
      }

      setIsRecording(false);
      setRecordingStartTime(null);
      
      console.log('🎥 Recording stopped and saved for session:', sessionId);
      
      toast({
        title: "Recording Saved",
        description: "Class recording has been saved successfully",
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast({
        title: "Error",
        description: "Failed to save recording",
        variant: "destructive"
      });
    }
  };

  if (!isTeacher) {
    return isRecording ? (
      <Badge className="bg-red-500 text-white animate-pulse">
        <Circle className="h-3 w-3 mr-1 fill-current" />
        RECORDING
      </Badge>
    ) : null;
  }

  return (
    <div className="flex items-center space-x-2">
      {isRecording ? (
        <>
          <Badge className="bg-red-500 text-white animate-pulse">
            <Circle className="h-3 w-3 mr-1 fill-current" />
            RECORDING
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={stopRecording}
            className="bg-red-50 border-red-200 hover:bg-red-100"
          >
            <Square className="h-4 w-4 mr-1" />
            Stop Recording
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={startRecording}
          className="bg-red-50 border-red-200 hover:bg-red-100"
        >
          <Circle className="h-4 w-4 mr-1" />
          Start Recording
        </Button>
      )}
    </div>
  );
};

export default RecordingManager;
