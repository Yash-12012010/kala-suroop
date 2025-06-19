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
    default: 'bg-white/95 text-gray-900 border-2 border-gray-200',
    premium: 'bg-gradient-to-br from-white/95 to-gray-50/95 text-gray-900 border-2 border-[#F19A3E]/30 shadow-lg',
    readable: 'bg-white/98 text-gray-900 border-2 border-[#F19A3E]/40 shadow-xl backdrop-blur-sm'
  };

  return (
    <Card className={cn(
      variants[variant],
      'transition-all duration-300 hover:shadow-2xl hover:border-[#F19A3E]/60 hover:scale-[1.02]',
      className
    )}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 font-bold text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="text-gray-800 leading-relaxed">
        {children}
      </CardContent>
    </Card>
  );
};