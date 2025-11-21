import React, { useState } from 'react';
import { Beer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Lobby({ onHost, onJoin, isMobile }) {
  const [name, setName] = useState('');
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <div className="text-center">
        <img src="/Logo 99.svg" alt="Le 99" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gold">{t('lobby.title')}</h1>
        <p className="text-xl opacity-80">{t('lobby.subtitle')}</p>
      </div>

      <div className="bg-black/30 p-8 rounded-xl backdrop-blur-sm w-full max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t('lobby.nameLabel')}</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-gold"
            placeholder={t('lobby.namePlaceholder')}
          />
        </div>
        
        <button 
          onClick={() => name && onJoin(name)}
          className="w-full bg-gold text-black font-bold py-3 rounded hover:bg-yellow-400 transition"
        >
          {t('lobby.join')}
        </button>

        {!isMobile && (
          <>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="flex-shrink mx-4 text-white/50 text-sm">{t('lobby.or')}</span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>

            <button 
              onClick={onHost}
              className="w-full bg-casino-red text-white font-bold py-3 rounded hover:bg-red-700 transition"
            >
              {t('lobby.host')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}