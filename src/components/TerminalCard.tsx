import React, { useState } from 'react';
import { Terminal } from '../types';
import { Zap, Copy, Check, Bookmark, BookmarkCheck, Cable, AlertCircle, Sparkles } from 'lucide-react';

interface TerminalCardProps {
  terminal: Terminal;
  isFavorite: boolean;
  onToggleFavorite: (terminalId: string) => void;
  onSelectTerminal?: (terminal: Terminal) => void;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({
  terminal,
  isFavorite,
  onToggleFavorite,
  onSelectTerminal
}) => {
  const [copiedSap, setCopiedSap] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, sapCode: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sapCode);
    setCopiedSap(sapCode);
    setTimeout(() => setCopiedSap(null), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Decodificador Digital': return 'bg-purple-900/40 text-purple-300 border-purple-700/50';
      case 'Cable Modem': return 'bg-blue-900/40 text-blue-300 border-blue-700/50';
      case 'eMTA': return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50';
      case 'ONT / Fibra': return 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50';
      case 'Extensor Wi-Fi MESH': return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div 
      className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-red-500/50 transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-red-950/20 overflow-hidden flex flex-col group"
      id={`terminal-card-${terminal.id}`}
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-950 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getCategoryColor(terminal.category)}`}>
              {terminal.category}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-950/60 text-red-400 border border-red-800/50">
              {terminal.voltage} ({terminal.power})
            </span>
          </div>
          <h2 
            className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors cursor-pointer"
            onClick={() => onSelectTerminal?.(terminal)}
          >
            {terminal.name}
          </h2>
        </div>

        <button
          onClick={() => onToggleFavorite(terminal.id)}
          className={`p-2 rounded-xl border transition-all ${
            isFavorite 
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar equipamento'}
        >
          {isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Electrical Specs Bar */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/60 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tensão / Corrente</span>
          <span className="font-semibold text-slate-200">{terminal.voltage} e {terminal.current}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Potência W</span>
          <span className="font-semibold text-slate-200">{terminal.power}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Conector</span>
          <span className="font-semibold text-slate-200 truncate block" title={terminal.connector}>{terminal.connector}</span>
        </div>
      </div>

      {/* Compatible Power Supplies List */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fontes Compatíveis ({terminal.powerSupplies.length})</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Clique no Cód. SAP para copiar
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {terminal.powerSupplies.map((ps) => (
              <div 
                key={ps.id}
                className={`p-3 rounded-xl border transition-all ${
                  ps.isAlternative 
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-600/60' 
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-100 text-sm truncate block" title={ps.model}>
                        {ps.model}
                      </span>
                      {ps.isAlternative && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-medium border border-amber-500/30 shrink-0">
                          Homologada Engenharia
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-400 mt-0.5 space-y-0.5">
                      <p><span className="text-slate-400 font-medium">Fabricante:</span> <strong className="text-slate-300 font-semibold">{ps.manufacturer}</strong></p>
                      {ps.partNumber && ps.partNumber !== 'N/A' && (
                        <p><span className="text-slate-400 font-medium">P/N:</span> <code className="text-slate-300 font-mono text-[11px]">{ps.partNumber}</code></p>
                      )}
                    </div>
                  </div>

                  {/* SAP Code Badge & Copy */}
                  <div className="shrink-0 text-right">
                    <button
                      onClick={(e) => handleCopy(e, ps.sapCode)}
                      disabled={ps.sapCode === 'Sem SAP' || ps.sapCode === 'SEM cadastro SAP'}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                        copiedSap === ps.sapCode
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : ps.sapCode.includes('/')
                            ? 'bg-slate-800 text-red-300 border-red-500/40 hover:bg-slate-700'
                            : 'bg-red-950/80 text-red-300 border-red-800/60 hover:bg-red-900/80 hover:text-white'
                      }`}
                      title="Copiar código SAP para transferência de estoque"
                    >
                      {copiedSap === ps.sapCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <span>SAP: {ps.sapCode}</span>
                          <Copy className="w-3 h-3 text-red-400/80" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Additional Notes or Cable warning */}
                {(ps.notes || ps.requiresPowerCable) && (
                  <div className="mt-2 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-amber-300/90 flex items-start space-x-1.5">
                    {ps.requiresPowerCable ? (
                      <Cable className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span>{ps.notes || 'Requer cabo de força separado (Código SAP 22026096)'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* View Details Button */}
        {onSelectTerminal && (
          <button
            onClick={() => onSelectTerminal(terminal)}
            className="w-full mt-3 py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/80 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Ver Ficha Técnica Completa</span>
          </button>
        )}
      </div>
    </div>
  );
};
