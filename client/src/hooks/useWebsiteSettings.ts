
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WebsiteSetting {
  key: string;
  value: any;
}

export const useWebsiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('key, value')
        .eq('is_public', true);

      if (error) throw error;

      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching website settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue?: any) => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  return {
    settings,
    loading,
    getSetting
  };
};
