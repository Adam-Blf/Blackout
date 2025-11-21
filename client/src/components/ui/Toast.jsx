import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-red-400/50">
        <AlertCircle size={20} />
        <span className="font-medium">{message}</span>
        <button onClick={() => setIsVisible(false)} className="ml-2 hover:bg-white/20 rounded-full p-1">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
