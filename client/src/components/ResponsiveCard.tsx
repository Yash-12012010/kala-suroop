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
    default: 'bg-white/10 backdrop-blur-md border border-white/20',
    glass: 'bg-white/15 backdrop-blur-xl border border-[#F19A3E]/30',
    premium: 'bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-2xl border-2 border-[#F19A3E]/40'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <Card className={cn(
      variants[variant],
      'shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl',
      className
    )}>
      {title && (
        <CardHeader className={cn(sizes[size], 'pb-4')}>
          <CardTitle className="text-white font-bold text-xl">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(title ? 'pt-0' : '', sizes[size])}>
        {children}
      </CardContent>
    </Card>
  );
};