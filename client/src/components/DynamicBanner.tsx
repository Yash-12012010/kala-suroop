
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, [position]);

  const fetchBanners = async () => {
    try {
      console.log(`Fetching banners for position: ${position}`);
      
      // Simplified query - remove complex date filtering for now
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .eq('position', position)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        return;
      }

      console.log(`Found ${data?.length || 0} banners for position ${position}:`, data);
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const dismissBanner = (bannerId: string) => {
    console.log('Dismissing banner:', bannerId);
    setDismissedBanners(prev => [...prev, bannerId]);
  };

  const activeBanners = banners.filter(banner => !dismissedBanners.includes(banner.id));

  // Debug info
  useEffect(() => {
    console.log(`DynamicBanner ${position} - Loading: ${loading}, Error: ${error}, Total banners: ${banners.length}, Active banners: ${activeBanners.length}, Dismissed: ${dismissedBanners.length}`);
  }, [position, loading, error, banners.length, activeBanners.length, dismissedBanners.length]);

  if (loading) {
    return (
      <div className="text-xs text-gray-500 p-2">
        Loading {position} banners...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-red-500 p-2 bg-red-50 border border-red-200">
        Error loading {position} banners: {error}
      </div>
    );
  }

  if (activeBanners.length === 0) {
    return (
      <div className="text-xs text-gray-400 p-2">
        No active {position} banners (Total: {banners.length}, Dismissed: {dismissedBanners.length})
      </div>
    );
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'relative w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md';
      case 'bottom':
        return 'relative w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md mt-8';
      case 'sidebar':
        return 'relative bg-white shadow-lg rounded-lg border my-4';
      case 'popup':
        return 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      default:
        return 'relative bg-gray-100 border border-gray-300';
    }
  };

  return (
    <div className={getPositionClasses()}>
      {activeBanners.map((banner, index) => (
        <div key={banner.id} className={`relative ${position === 'popup' ? 'bg-white rounded-lg max-w-md mx-4 shadow-xl' : ''} ${index > 0 ? 'border-t border-white/20' : ''}`}>
          <div className={`${position === 'popup' ? 'p-6' : 'px-4 py-3'} flex items-center justify-between`}>
            <div className="flex-1">
              {banner.image_url && (
                <img 
                  src={banner.image_url} 
                  alt={banner.title}
                  className={`${position === 'popup' ? 'w-full h-32 object-cover rounded mb-4' : 'w-8 h-8 object-cover rounded mr-3'} inline-block`}
                  onError={(e) => {
                    console.error('Banner image failed to load:', banner.image_url);
                    e.currentTarget.style.display = 'none';
                  }}
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
              className={`${position === 'popup' ? 'absolute top-2 right-2 text-gray-400 hover:text-gray-600' : 'ml-4 hover:opacity-75'} transition-opacity flex-shrink-0`}
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
