import React from 'react';

export default function Card({ card, size = 'md' }) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  const sizeClasses = {
    sm: 'w-12 h-16 text-xs',
    md: 'w-20 h-28 text-base',
    lg: 'w-32 h-44 text-xl',
  };

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-lg shadow-lg flex flex-col justify-between p-2 select-none transform hover:scale-105 transition-transform duration-200 border border-gray-300`}>
      <div className={`font-bold ${isRed ? 'text-red-600' : 'text-black'} leading-none`}>
        {card.value}
        <div className="text-[0.6em]">{card.suit}</div>
      </div>
      
      <div className={`self-center text-2xl ${isRed ? 'text-red-600' : 'text-black'}`}>
        {card.suit}
      </div>

      <div className={`font-bold ${isRed ? 'text-red-600' : 'text-black'} leading-none self-end rotate-180`}>
        {card.value}
        <div className="text-[0.6em]">{card.suit}</div>
      </div>
    </div>
  );
}