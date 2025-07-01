
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: string | null;
  order_index: number;
  required_role: string | null;
  is_external: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
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
        // Hide "Updates" page from navigation
        if (item.name === 'Updates') {
          return false;
        }
        
        if (!user && item.required_role !== 'user') {
          return false;
        }
        if (item.required_role === 'admin' && !isAdmin) {
          return false;
        }
        return true;
      }).map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        icon: item.icon,
        order_index: item.order_index,
        required_role: item.required_role || 'user',
        is_external: item.is_external,
        is_active: item.is_active,
        created_at: item.created_at,
        updated_at: item.updated_at,
        parent_id: item.parent_id
      }));

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
