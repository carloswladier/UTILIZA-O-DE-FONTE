import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { QuickStatsHeader } from './components/QuickStatsHeader';
import { TerminalCard } from './components/TerminalCard';
import { PowerSupplyCard } from './components/PowerSupplyCard';
import { TerminalDetailModal } from './components/TerminalDetailModal';
import { ScannerModal } from './components/ScannerModal';
import { TechnicalGuideTab } from './components/TechnicalGuideTab';
import { TERMINALS_DATA } from './data/terminalsData';
import { Terminal, PowerSupply, TerminalCategory } from './types';
import { Search, Filter, X, Bookmark, Zap, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'fonte' | 'scanner' | 'guide'>('terminal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVoltage, setSelectedVoltage] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('claro_fontes_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Toggle favorite
  const handleToggleFavorite = (terminalId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(terminalId)
        ? prev.filter((id) => id !== terminalId)
        : [...prev, terminalId];
      try {
        localStorage.setItem('claro_fontes_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return updated;
    });
  };

  // Categories list
  const categories: { label: string; value: string }[] = [
    { label: 'Todos os Equipamentos', value: 'all' },
    { label: 'Decodificador Digital', value: 'Decodificador Digital' },
    { label: 'Cable Modem', value: 'Cable Modem' },
    { label: 'eMTA', value: 'eMTA' },
    { label: 'ONT / Fibra', value: 'ONT / Fibra' },
    { label: 'Extensor Wi-Fi MESH', value: 'Extensor Wi-Fi MESH' },
    { label: 'Cabos de Força', value: 'Cabo de Força' }
  ];

  // Voltages list
  const voltages = ['all', '5V', '9V', '12V', '14V', '15V', '115-240V'];

  // Filter Terminals
  const filteredTerminals = useMemo(() => {
    return TERMINALS_DATA.filter((t) => {
      if (showFavoritesOnly && !favorites.includes(t.id)) {
        return false;
      }

      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }

      if (selectedVoltage !== 'all' && t.voltage !== selectedVoltage) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesCategory = t.category.toLowerCase().includes(q);
        const matchesVoltage = t.voltage.toLowerCase().includes(q);
        const matchesPower = t.power.toLowerCase().includes(q);
        const matchesPowerSupplies = t.powerSupplies.some(
          (p) =>
            p.model.toLowerCase().includes(q) ||
            p.sapCode.toLowerCase().includes(q) ||
            p.manufacturer.toLowerCase().includes(q) ||
            p.partNumber.toLowerCase().includes(q)
        );

        return matchesName || matchesCategory || matchesVoltage || matchesPower || matchesPowerSupplies;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedVoltage, showFavoritesOnly, favorites]);

  // Aggregate Power Supplies for "Search by Fonte / SAP"
  const aggregatedPowerSupplies = useMemo(() => {
    const map = new Map<
      string,
      PowerSupply & { terminals: Terminal[]; voltage: string; current: string; power: string }
    >();

    TERMINALS_DATA.forEach((terminal) => {
      terminal.powerSupplies.forEach((ps) => {
        // Unique key by model + SAP
        const key = `${ps.model}-${ps.sapCode}-${ps.manufacturer}`;
        if (!map.has(key)) {
          map.set(key, {
            ...ps,
            terminals: [terminal],
            voltage: terminal.voltage,
            current: terminal.current,
            power: terminal.power
          });
        } else {
          const existing = map.get(key)!;
          if (!existing.terminals.some((t) => t.id === terminal.id)) {
            existing.terminals.push(terminal);
          }
        }
      });
    });

    let list = Array.from(map.values());

    if (selectedVoltage !== 'all') {
      list = list.filter((p) => p.voltage === selectedVoltage);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        return (
          p.model.toLowerCase().includes(q) ||
          p.sapCode.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q) ||
          p.terminals.some((t) => t.name.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [searchQuery, selectedVoltage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-red-600 selection:text-white pb-16">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setShowFavoritesOnly(false);
        }}
        favoritesCount={favorites.length}
        onOpenFavorites={() => {
          setActiveTab('terminal');
          setShowFavoritesOnly(true);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Quick Header Stats */}
        <QuickStatsHeader />

        {/* Tab Content 1 & 2: Search Filters */}
        {(activeTab === 'terminal' || activeTab === 'fonte') && (
          <div className="space-y-6">
            {/* Search Input & Filter Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'terminal'
                      ? 'Digite o modelo do terminal (ex: H196A, DCI106, S4KW3, Z4KW6, FAST3895, CG3000...)'
                      : 'Digite a Fonte ou Código SAP (ex: 22026278, MU06-B050120, MEIC, LITE ON, MOSO...)'
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-12 pr-10 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
                {/* Category Chips */}
                {activeTab === 'terminal' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 w-full">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all border truncate flex items-center justify-center ${
                          selectedCategory === cat.value
                            ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40 font-bold'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800'
                        }`}
                        title={cat.label}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Voltage Selector */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                    <Filter className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tensão:</span>
                  </span>
                  <select
                    value={selectedVoltage}
                    onChange={(e) => setSelectedVoltage(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-red-500"
                  >
                    {voltages.map((v) => (
                      <option key={v} value={v}>
                        {v === 'all' ? 'Todas as Tensões' : v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filter Indicators */}
              {(showFavoritesOnly || selectedCategory !== 'all' || selectedVoltage !== 'all' || searchQuery) && (
                <div className="flex items-center space-x-2 pt-2 text-xs text-slate-400 flex-wrap gap-y-1">
                  <span className="font-semibold text-slate-300">Filtros ativos:</span>
                  {showFavoritesOnly && (
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center space-x-1">
                      <span>Salvos/Favoritos</span>
                      <button onClick={() => setShowFavoritesOnly(false)} className="hover:text-white ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="bg-red-950 text-red-300 px-2 py-0.5 rounded-md border border-red-800 flex items-center space-x-1">
                      <span>Categoria: {selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('all')} className="hover:text-white ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedVoltage !== 'all' && (
                    <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded-md border border-amber-800 flex items-center space-x-1">
                      <span>Tensão: {selectedVoltage}</span>
                      <button onClick={() => setSelectedVoltage('all')} className="hover:text-white ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedVoltage('all');
                      setShowFavoritesOnly(false);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 underline font-semibold ml-auto"
                  >
                    Limpar Todos
                  </button>
                </div>
              )}
            </div>

            {/* Results Grid - Tab 1: Terminal Mode */}
            {activeTab === 'terminal' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-red-400" />
                    <span>Terminais Encontrados ({filteredTerminals.length})</span>
                  </span>
                </div>

                {filteredTerminals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTerminals.map((terminal) => (
                      <TerminalCard
                        key={terminal.id}
                        terminal={terminal}
                        isFavorite={favorites.includes(terminal.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onSelectTerminal={(t) => setSelectedTerminal(t)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
                    <Cpu className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-200">Nenhum terminal encontrado</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Tente alterar os termos de busca ou limpar os filtros de categoria e tensão.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedVoltage('all');
                        setShowFavoritesOnly(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Ver Todos os Terminais
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Results Grid - Tab 2: Reverse Lookup (Power Supply / SAP Mode) */}
            {activeTab === 'fonte' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Modelos de Fontes & Códigos SAP ({aggregatedPowerSupplies.length})</span>
                  </span>
                </div>

                {aggregatedPowerSupplies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aggregatedPowerSupplies.map((ps, idx) => (
                      <PowerSupplyCard
                        key={`${ps.id}-${idx}`}
                        powerSupply={ps}
                        onSelectTerminal={(t) => {
                          setSelectedTerminal(t);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
                    <Zap className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-200">Nenhuma fonte encontrada</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Tente buscar por fabricantes como MEIC, LITE ON, NETBIT, AC BEL, MOSO ou insira o código SAP de 8 dígitos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Scanner IA */}
        {activeTab === 'scanner' && (
          <ScannerModal
            onSelectTerminal={(t) => {
              setSelectedTerminal(t);
            }}
          />
        )}

        {/* Tab Content 4: Technical Guide */}
        {activeTab === 'guide' && <TechnicalGuideTab />}
      </main>

      {/* Terminal Detail Modal */}
      <TerminalDetailModal
        terminal={selectedTerminal}
        onClose={() => setSelectedTerminal(null)}
        isFavorite={selectedTerminal ? favorites.includes(selectedTerminal.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
