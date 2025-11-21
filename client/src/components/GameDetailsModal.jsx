import React from 'react';
import { X, BookOpen, AlertTriangle } from 'lucide-react';

const GameDetailsModal = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-900/20">
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-purple-500/20 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{game.title}</h2>
              <p className="text-sm text-gray-400">{game.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Status Banner */}
          {!game.isPlayable && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500">Jeu non numérique</h3>
                <p className="text-sm text-yellow-200/70">
                  Ce jeu n'est pas encore implémenté dans l'application. 
                  Utilisez ces règles pour jouer avec vos propres cartes ou matériel !
                </p>
              </div>
            </div>
          )}

          {/* Rules Sections */}
          {game.rules ? (
            <div className="space-y-6">
              {game.rules.map((section, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-xs text-purple-300 border border-purple-500/30">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h3>
                  <ul className="space-y-2 ml-2">
                    {section.content.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune règle détaillée disponible pour ce jeu.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur border-t border-purple-500/20 p-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors font-medium"
          >
            Fermer
          </button>
          {game.isPlayable && (
            <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors font-bold shadow-lg shadow-purple-900/20">
              Jouer maintenant
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default GameDetailsModal;
