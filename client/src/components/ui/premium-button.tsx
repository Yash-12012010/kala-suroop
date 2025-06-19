import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PremiumButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  asChild?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  asChild,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white shadow-2xl hover:shadow-3xl border-2 border-white/30',
    secondary: 'bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A] hover:from-[#6fa085] hover:to-[#a3d179] text-white shadow-xl hover:shadow-2xl border-2 border-white/25',
    outline: 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-xl'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <Button
      className={cn(
        'btn-enhanced font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      asChild={asChild}
      {...props}
    >
      {children}
    </Button>
  );
};