import React, { useState } from 'react';
import { Terminal } from '../types';
import { Zap, Copy, Check, Bookmark, BookmarkCheck, Cable, AlertCircle, Sparkles, Tag } from 'lucide-react';
import { getPsuLabelInfo } from '../utils/psuLabels';

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
  const psuInfo = getPsuLabelInfo(terminal.voltage, terminal.current);

  const handleCopy = (e: React.MouseEvent, sapCode: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sapCode);
    setCopiedSap(sapCode);
    setTimeout(() => setCopiedSap(null), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Decodificador Digital': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cable Modem': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'eMTA': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ONT / Fibra': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Extensor Wi-Fi MESH': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 hover:border-red-500/80 transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden flex flex-col group"
      id={`terminal-card-${terminal.id}`}
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getCategoryColor(terminal.category)}`}>
              {terminal.category}
            </span>
            <span 
              className={`text-xs px-2.5 py-0.5 rounded-md font-black tracking-wide uppercase shadow-xs border ${psuInfo.badgeBg} ${psuInfo.badgeText}`}
              style={psuInfo.customStyle}
              title={`Etiqueta Física da Fonte: ${psuInfo.labelDescription}`}
            >
              Etiqueta: {psuInfo.displayTag}
            </span>
          </div>
          <h2 
            className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-red-600 transition-colors cursor-pointer"
            onClick={() => onSelectTerminal?.(terminal)}
          >
            {terminal.name}
          </h2>
        </div>

        <button
          onClick={() => onToggleFavorite(terminal.id)}
          className={`p-2 rounded-xl border transition-all ${
            isFavorite 
              ? 'bg-amber-50 border-amber-300 text-amber-600' 
              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar equipamento'}
        >
          {isFavorite ? <BookmarkCheck className="w-5 h-5 fill-amber-500/20" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Electrical Specs Bar */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-slate-100/60 border-b border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tensão / Corrente</span>
          <span className="font-semibold text-slate-800">{terminal.voltage} e {terminal.current}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">Potência W</span>
          <span className="font-semibold text-slate-800">{terminal.power}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">Conector</span>
          <span className="font-semibold text-slate-800 truncate block" title={terminal.connector}>{terminal.connector}</span>
        </div>
      </div>

      {/* Compatible Power Supplies List */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
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
                    ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300' 
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm truncate block" title={ps.model}>
                        {ps.model}
                      </span>
                      {ps.isAlternative && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold border border-amber-200 shrink-0">
                          Homologada Engenharia
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-500 mt-0.5 space-y-0.5">
                      <p><span className="text-slate-500 font-medium">Fabricante:</span> <strong className="text-slate-700 font-semibold">{ps.manufacturer}</strong></p>
                      {ps.partNumber && ps.partNumber !== 'N/A' && (
                        <p><span className="text-slate-500 font-medium">P/N:</span> <code className="text-slate-800 font-mono text-[11px]">{ps.partNumber}</code></p>
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
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white'
                            : 'bg-red-600 text-white border-red-600 hover:bg-red-700'
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
                          <Copy className="w-3 h-3 text-white/80" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Additional Notes or Cable warning */}
                {(ps.notes || ps.requiresPowerCable) && (
                  <div className="mt-2 text-[11px] bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900 flex items-start space-x-1.5">
                    {ps.requiresPowerCable ? (
                      <Cable className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
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
            className="w-full mt-3 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Ver Ficha Técnica Completa</span>
          </button>
        )}
      </div>
    </div>
  );
};
