import React, { useState } from 'react';
import { Beer, Monitor, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Lobby({ onHost, onJoin, isMobile, initialRoomCode }) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <div className="text-center">
        <img src="/Logo 99.svg" alt="Le 99" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gold">{t('lobby.title')}</h1>
        <p className="text-xl opacity-80">{t('lobby.subtitle')}</p>
      </div>

      <div className="bg-black/30 p-8 rounded-xl backdrop-blur-sm w-full max-w-md space-y-6 border border-white/10 shadow-2xl">
        
        {/* DESKTOP: Host Button First (TV Mode) */}
        {!isMobile && (
          <div className="space-y-4">
            <button 
              onClick={onHost}
              className="w-full bg-gradient-to-r from-casino-red to-red-900 text-white font-bold py-4 rounded-xl hover:scale-105 transition shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/30 flex items-center justify-center gap-3 group"
            >
              <Monitor size={28} className="group-hover:animate-pulse" />
              <div className="text-left">
                <div className="text-lg leading-none uppercase tracking-wider">{t('lobby.host')}</div>
                <div className="text-xs opacity-70 font-normal">Use PC as TV Screen</div>
              </div>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-white/30 text-xs uppercase tracking-widest">Or Join as Player</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
          </div>
        )}

        {/* JOIN FORM (Primary for Mobile) */}
        <div className="space-y-4">
            {isMobile && (
                <div className="text-center text-gold/80 font-bold flex items-center justify-center gap-2 mb-4 bg-gold/10 py-2 rounded-lg">
                    <Smartphone size={20} />
                    <span>Mobile Player Mode</span>
                </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">{t('lobby.nameLabel')}</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-gold focus:bg-white/10 transition"
                placeholder={t('lobby.namePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Room Code</label>
              <input 
                type="text" 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-gold focus:bg-white/10 transition font-mono tracking-widest text-center text-lg uppercase"
                placeholder="CODE"
                maxLength={6}
              />
            </div>
            
            <button 
              onClick={() => name && roomCode && onJoin(name, roomCode)}
              className="w-full bg-gold text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              disabled={!name || !roomCode}
            >
              {t('lobby.join')}
            </button>
        </div>

      </div>
    </div>
  );
}