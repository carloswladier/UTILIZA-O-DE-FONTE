import React from 'react';
import { Search, Zap, Cpu, Camera, Bookmark, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'terminal' | 'fonte' | 'scanner' | 'guide';
  setActiveTab: (tab: 'terminal' | 'fonte' | 'scanner' | 'guide') => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenFavorites
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('terminal')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-900/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">Claro<span className="text-red-500">net</span></span>
                <span className="text-xs bg-red-600/30 text-red-300 px-2 py-0.5 rounded-full font-medium border border-red-500/30">
                  Book de Fontes
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Consulta de Fontes e Acessórios de Terminais
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'terminal'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Por Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('fonte')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'fonte'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Por Fonte / SAP</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scanner'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Leitor IA (Foto)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guia Tensão/SAP</span>
            </button>
          </nav>

          {/* Favorites Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenFavorites}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700 relative"
              title="Equipamentos Favoritados"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Salvos</span>
              {favoritesCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              activeTab === 'terminal' ? 'text-red-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Cpu className="w-4 h-4 mb-0.5" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('fonte')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              activeTab === 'fonte' ? 'text-red-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span>Fonte/SAP</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              activeTab === 'scanner' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Camera className="w-4 h-4 mb-0.5" />
            <span>Scanner IA</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              activeTab === 'guide' ? 'text-red-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Guia</span>
          </button>
        </div>
      </div>
    </header>
  );
};
