import React, { useState, useMemo } from 'react';
import { 
  Beer, Spade, MessageCircle, Info, Globe, 
  Bus, Triangle, Crown, Circle, Hash, MessageSquare, Hand, Eye, Zap,
  Trophy, Ghost, Ban, Dices, Target, Rotate3d, Disc, Search
} from 'lucide-react';
import RulesModal from './RulesModal';
import GameDetailsModal from './GameDetailsModal';
import { useLanguage } from '../contexts/LanguageContext';
import { gamesList } from '../data/games';

const iconMap = {
  Spade, Bus, Triangle, Crown, Circle, Hash, MessageSquare, Hand, Eye, Zap,
  Trophy, Ghost, Ban, Dices, Target, Rotate3d, Disc, MessageCircle
};

export default function Home({ onSelectGame }) {
  const [showRules, setShowRules] = useState(false);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const handleGameAction = (game) => {
    if (game.id === '99') {
      onSelectGame('99');
    } else {
      setSelectedGameDetails(game);
    }
  };

  const filteredGames = useMemo(() => {
    return gamesList.filter(game => 
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black relative overflow-x-hidden">
      
      {/* Language Toggle */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10 z-10"
      >
        <Globe size={16} />
        <span className="uppercase font-bold text-sm">{language}</span>
      </button>

      <div className="text-center mt-12 mb-12 animate-in fade-in slide-in-from-top-10 duration-700">
        <h1 className="text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          BLACKOUT
        </h1>
        <p className="text-xl text-gray-400 font-light tracking-widest uppercase mb-8">{t('home.subtitle')}</p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-purple-500 transition-colors sm:text-sm"
            placeholder="Rechercher un jeu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl w-full px-4 pb-20">
        {filteredGames.map((game) => {
          const Icon = iconMap[game.icon] || Beer;
          const isPlayable = game.isPlayable;

          return (
            <div 
              key={game.id}
              className={`group relative bg-neutral-800 rounded-3xl p-1 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${!isPlayable ? 'opacity-90' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${isPlayable ? 'from-purple-600 to-pink-600' : 'from-gray-700 to-gray-600'} rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm`}></div>
              <div className="relative h-full bg-neutral-900 rounded-[22px] p-6 flex flex-col items-center text-center border border-white/5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border ${isPlayable ? 'bg-purple-900/30 border-purple-500/30' : 'bg-gray-800/50 border-white/10'}`}>
                  <Icon className={`w-8 h-8 ${isPlayable ? 'text-purple-400' : 'text-gray-400'}`} />
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${isPlayable ? 'text-white' : 'text-gray-300'}`}>{game.title}</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed line-clamp-3">{game.description}</p>
                
                <div className="mt-auto flex gap-2 w-full">
                  {isPlayable ? (
                    <>
                      <button 
                        onClick={() => handleGameAction(game)}
                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white text-sm shadow-lg shadow-purple-900/50 hover:shadow-purple-500/50 transition-all active:scale-95"
                      >
                        JOUER
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowRules(true); }}
                        className="px-3 py-2 bg-neutral-800 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-700 transition-colors border border-white/10"
                      >
                        <Info size={18} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setSelectedGameDetails(game)}
                      className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium text-gray-400 text-sm border border-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Info size={16} />
                      Règles
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredGames.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun jeu trouvé pour "{searchTerm}"
          </div>
        )}
      </div>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <GameDetailsModal game={selectedGameDetails} onClose={() => setSelectedGameDetails(null)} />
    </div>
  );
}