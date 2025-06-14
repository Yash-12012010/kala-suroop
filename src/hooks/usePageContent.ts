
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  content: any;
  is_active: boolean;
}

export const usePageContent = (pageSlug: string, sectionKey?: string) => {
  const [content, setContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [pageSlug, sectionKey]);

  const fetchContent = async () => {
    try {
      let query = supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('is_active', true);

      if (sectionKey) {
        query = query.eq('section_key', sectionKey);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentBySection = (section: string) => {
    const sectionContent = content.find(item => item.section_key === section);
    return sectionContent?.content || null;
  };

  return {
    content,
    loading,
    getContentBySection,
    refetch: fetchContent
  };
};
