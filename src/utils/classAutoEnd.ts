
import { supabase } from '@/integrations/supabase/client';

export const checkAndEndExpiredClasses = async () => {
  try {
    console.log('Checking for expired live classes...');
    
    // Find all live sessions that have passed their scheduled end time and still have an agora channel
    const { data: expiredSessions, error } = await supabase
      .from('live_sessions')
      .select('*')
      .not('agora_channel', 'is', null)
      .lt('scheduled_end', new Date().toISOString());

    if (error) {
      console.error('Error fetching expired sessions:', error);
      return;
    }

    if (!expiredSessions || expiredSessions.length === 0) {
      console.log('No expired classes found');
      return;
    }

    console.log(`Found ${expiredSessions.length} expired classes to end`);

    // End each expired session
    for (const session of expiredSessions) {
      console.log(`Ending expired class: ${session.title}`);
      
      const { error: updateError } = await supabase
        .from('live_sessions')
        .update({
          agora_channel: null,
          scheduled_end: new Date().toISOString()
        })
        .eq('id', session.id);

      if (updateError) {
        console.error(`Error ending class ${session.title}:`, updateError);
      } else {
        console.log(`Successfully ended class: ${session.title}`);
        
        // Create an announcement about the ended class
        try {
          await supabase
            .from('announcements')
            .insert({
              title: `Class Ended: ${session.title}`,
              content: `${session.title} has automatically ended as scheduled. Thank you for attending!`,
              type: 'info',
              target_audience: 'all',
              is_active: true,
              is_pinned: false
            });
        } catch (announcementError) {
          console.error('Error creating end announcement:', announcementError);
        }
      }
    }
  } catch (error) {
    console.error('Error in checkAndEndExpiredClasses:', error);
  }
};

export const startAutoEndScheduler = () => {
  // Check every minute for expired classes
  const interval = setInterval(checkAndEndExpiredClasses, 60000);
  
  // Initial check
  checkAndEndExpiredClasses();
  
  return interval;
};

export const stopAutoEndScheduler = (intervalId: NodeJS.Timeout) => {
  clearInterval(intervalId);
};
