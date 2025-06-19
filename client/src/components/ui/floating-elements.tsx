import React from 'react';

export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Premium floating orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full animate-pulse opacity-20 ${
            i % 4 === 0 ? 'bg-gradient-to-r from-[#F19A3E] to-[#D7F171]' :
            i % 4 === 1 ? 'bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A]' :
            i % 4 === 2 ? 'bg-gradient-to-r from-[#D7F171] to-[#F19A3E]' :
            'bg-gradient-to-r from-[#B5EF8A] to-[#7FC29B]'
          }`}
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 12}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        />
      ))}
      
      {/* Elegant light rays */}
      <div className="absolute top-0 left-1/4 w-px h-screen bg-gradient-to-b from-transparent via-[#F19A3E]/10 to-transparent animate-pulse" />
      <div className="absolute top-0 right-1/3 w-px h-screen bg-gradient-to-b from-transparent via-[#7FC29B]/8 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-0 left-2/3 w-px h-screen bg-gradient-to-b from-transparent via-[#D7F171]/6 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};