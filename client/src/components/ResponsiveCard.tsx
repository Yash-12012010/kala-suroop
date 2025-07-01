
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'glass' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className,
  title,
  variant = 'default',
  size = 'md'
}) => {
  const variants = {
    default: 'bg-white/95 backdrop-blur-2xl border-2 border-white/40 shadow-2xl',
    glass: 'bg-white/98 backdrop-blur-2xl border-3 border-[#F19A3E]/50 shadow-2xl',
    premium: 'bg-white/99 backdrop-blur-2xl border-3 border-[#F19A3E]/60 shadow-3xl'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <Card className={cn(
      variants[variant],
      'hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl hover:bg-white/99',
      className
    )}>
      {title && (
        <CardHeader className={cn(sizes[size], 'pb-4')}>
          <CardTitle className="text-gray-900 font-black text-xl drop-shadow-sm">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(title ? 'pt-0' : '', sizes[size])}>
        <div className="text-gray-800 font-medium">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
