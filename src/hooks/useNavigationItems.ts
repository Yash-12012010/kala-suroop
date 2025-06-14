
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: string | null;
  order_index: number;
  required_role: string;
  is_external: boolean;
}

export const useNavigationItems = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchNavigationItems();
  }, [user, isAdmin]);

  const fetchNavigationItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      // Filter items based on user role and authentication status
      const filteredItems = (data || []).filter(item => {
        if (!user && item.required_role !== 'user') {
          return false;
        }
        if (item.required_role === 'admin' && !isAdmin) {
          return false;
        }
        return true;
      });

      setNavItems(filteredItems);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    navItems,
    loading,
    refetch: fetchNavigationItems
  };
};
