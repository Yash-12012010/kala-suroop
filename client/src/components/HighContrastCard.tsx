
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HighContrastCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'premium' | 'readable';
}

export const HighContrastCard: React.FC<HighContrastCardProps> = ({
  children,
  className,
  title,
  variant = 'readable'
}) => {
  const variants = {
    default: 'bg-white/98 text-gray-900 border-3 border-gray-300 shadow-2xl backdrop-blur-xl',
    premium: 'bg-white/98 text-gray-900 border-3 border-[#F19A3E]/60 shadow-2xl backdrop-blur-xl',
    readable: 'bg-white/99 text-gray-900 border-3 border-[#F19A3E]/70 shadow-2xl backdrop-blur-xl'
  };

  return (
    <Card className={cn(
      variants[variant],
      'transition-all duration-300 hover:shadow-3xl hover:border-[#F19A3E] hover:scale-[1.02] hover:bg-white',
      className
    )}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 font-black text-xl drop-shadow-sm">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="text-gray-800 leading-relaxed font-medium">
        {children}
      </CardContent>
    </Card>
  );
};
