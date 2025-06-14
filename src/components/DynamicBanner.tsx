
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  link_url: string | null;
  position: string;
  priority: number;
}

interface DynamicBannerProps {
  position: 'top' | 'bottom' | 'sidebar' | 'popup';
}

const DynamicBanner: React.FC<DynamicBannerProps> = ({ position }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);

  useEffect(() => {
    fetchBanners();
  }, [position]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .eq('position', position)
        .or(`start_date.is.null,start_date.lte.${new Date().toISOString()}`)
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .order('priority', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const dismissBanner = (bannerId: string) => {
    setDismissedBanners(prev => [...prev, bannerId]);
  };

  const activeBanners = banners.filter(banner => !dismissedBanners.includes(banner.id));

  if (activeBanners.length === 0) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-pink-500 text-white';
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-pink-500 text-white';
      case 'sidebar':
        return 'sticky top-20 bg-white shadow-lg rounded-lg border';
      case 'popup':
        return 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      default:
        return '';
    }
  };

  return (
    <div className={getPositionClasses()}>
      {activeBanners.map((banner) => (
        <div key={banner.id} className={`relative ${position === 'popup' ? 'bg-white rounded-lg max-w-md mx-4 shadow-xl' : ''}`}>
          <div className={`${position === 'popup' ? 'p-6' : 'px-4 py-2'} flex items-center justify-between`}>
            <div className="flex-1">
              {banner.image_url && (
                <img 
                  src={banner.image_url} 
                  alt={banner.title}
                  className={`${position === 'popup' ? 'w-full h-32 object-cover rounded mb-4' : 'w-8 h-8 object-cover rounded mr-3'} inline-block`}
                />
              )}
              <div className={position === 'popup' ? '' : 'inline-block'}>
                <h3 className={`font-semibold ${position === 'popup' ? 'text-lg text-gray-900 mb-2' : 'text-sm'}`}>
                  {banner.title}
                </h3>
                {banner.content && (
                  <p className={`${position === 'popup' ? 'text-gray-600 mb-4' : 'text-xs opacity-90'}`}>
                    {banner.content}
                  </p>
                )}
                {banner.link_url && (
                  <a 
                    href={banner.link_url}
                    className={`${position === 'popup' ? 'bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600' : 'underline hover:no-underline'} transition-colors`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissBanner(banner.id)}
              className={`${position === 'popup' ? 'absolute top-2 right-2 text-gray-400 hover:text-gray-600' : 'ml-4 hover:opacity-75'} transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicBanner;
