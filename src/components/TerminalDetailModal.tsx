import React, { useState } from 'react';
import { Terminal } from '../types';
import { X, Zap, Copy, Check, Printer, Bookmark, BookmarkCheck, ShieldAlert, Cpu, Cable } from 'lucide-react';

interface TerminalDetailModalProps {
  terminal: Terminal | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const TerminalDetailModal: React.FC<TerminalDetailModalProps> = ({
  terminal,
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  if (!terminal) return null;

  const [copiedSap, setCopiedSap] = useState<string | null>(null);

  const handleCopySap = (sapCode: string) => {
    navigator.clipboard.writeText(sapCode);
    setCopiedSap(sapCode);
    setTimeout(() => setCopiedSap(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 pr-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
              <span className="text-xs bg-red-600/30 text-red-300 font-bold px-2.5 py-0.5 rounded-full border border-red-500/40">
                {terminal.category}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2.5 py-0.5 rounded-full border border-slate-700">
                {terminal.voltage} ({terminal.power})
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Terminal {terminal.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ficha Técnica Oficial e Mapeamento de Fontes Homologadas Claro NET
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(terminal.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Favoritar"
            >
              {isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
              title="Imprimir Ficha"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tensão</span>
            <span className="text-lg font-black text-white">{terminal.voltage}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Corrente</span>
            <span className="text-lg font-black text-white">{terminal.current}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Potência</span>
            <span className="text-lg font-black text-white">{terminal.power}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Plug / Conector</span>
            <span className="text-xs font-bold text-slate-200 block truncate" title={terminal.connector}>
              {terminal.connector}
            </span>
          </div>
        </div>

        {/* Power Supplies List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Modelos de Fontes Homologadas ({terminal.powerSupplies.length})</span>
            </h3>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {terminal.powerSupplies.map((ps) => (
              <div 
                key={ps.id}
                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-4 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-base text-white">{ps.model}</span>
                      {ps.isAlternative && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium border border-amber-500/30">
                          Homologada Engenharia
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                      <p><span className="text-slate-400">Fabricante:</span> <strong className="text-slate-200">{ps.manufacturer}</strong></p>
                      {ps.partNumber && ps.partNumber !== 'N/A' && (
                        <p><span className="text-slate-400">P/N:</span> <code className="text-slate-300 font-mono">{ps.partNumber}</code></p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    <button
                      onClick={() => handleCopySap(ps.sapCode)}
                      disabled={ps.sapCode === 'Sem SAP' || ps.sapCode === 'SEM cadastro SAP'}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                        copiedSap === ps.sapCode
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-md'
                      }`}
                    >
                      {copiedSap === ps.sapCode ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar SAP: {ps.sapCode}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {ps.notes && (
                  <div className="mt-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-amber-300 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{ps.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-red-500" />
            <span>Rede HFC / Fibra Claro NET</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
