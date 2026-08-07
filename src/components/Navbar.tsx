import React from 'react';
import { Zap, Cpu, Camera, Bookmark, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'terminal' | 'scanner' | 'acessos';
  setActiveTab: (tab: 'terminal' | 'scanner' | 'acessos') => void;
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
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('terminal')}>
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-600/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Claro</span>
                <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-semibold border border-red-200">
                  Book de Fontes
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Consulta de Fontes e Acessórios de Terminais
              </p>
            </div>
          </div>

          {/* Navigation Links - Por Terminal, Leitor IA (Foto), and Acessos ao Site */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'terminal'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Por Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-500" />
              <span>Leitor IA (Foto)</span>
            </button>

            <button
              onClick={() => setActiveTab('acessos')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'acessos'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Acessos no Site</span>
            </button>
          </nav>

          {/* Favorites Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenFavorites}
              className="flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-200 relative"
              title="Equipamentos Favoritados"
            >
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500/20" />
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
        <div className="md:hidden flex items-center justify-center space-x-2 py-2 border-t border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center space-x-1 py-1.5 px-3 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'terminal' ? 'bg-red-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Por Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center space-x-1 py-1.5 px-3 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'scanner' ? 'bg-red-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Leitor IA</span>
          </button>

          <button
            onClick={() => setActiveTab('acessos')}
            className={`flex items-center space-x-1 py-1.5 px-3 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'acessos' ? 'bg-red-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Acessos</span>
          </button>
        </div>
      </div>
    </header>
  );
};

