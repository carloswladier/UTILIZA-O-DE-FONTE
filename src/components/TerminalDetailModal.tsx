import React, { useState } from 'react';
import { Terminal } from '../types';
import { X, Zap, Copy, Check, Printer, Bookmark, BookmarkCheck, ShieldAlert, Cpu, Tag } from 'lucide-react';
import { getPsuLabelInfo } from '../utils/psuLabels';

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
  const psuInfo = getPsuLabelInfo(terminal.voltage, terminal.current);

  const handleCopySap = (sapCode: string) => {
    navigator.clipboard.writeText(sapCode);
    setCopiedSap(sapCode);
    setTimeout(() => setCopiedSap(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 pr-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
              <span className="text-xs bg-red-50 text-red-700 font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                {terminal.category}
              </span>
              <span 
                className={`text-xs px-3 py-0.5 rounded-md font-black tracking-wide uppercase shadow-xs border ${psuInfo.badgeBg} ${psuInfo.badgeText}`}
                style={psuInfo.customStyle}
              >
                Etiqueta: {psuInfo.displayTag}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Terminal {terminal.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ficha Técnica Oficial e Mapeamento de Fontes Homologadas Claro
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(terminal.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-50 border-amber-300 text-amber-600' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Favoritar"
            >
              {isFavorite ? <BookmarkCheck className="w-5 h-5 fill-amber-500/20" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl transition-colors"
              title="Imprimir Ficha"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Tensão</span>
            <span className="text-lg font-black text-slate-900">{terminal.voltage}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Corrente</span>
            <span className="text-lg font-black text-slate-900">{terminal.current}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Potência</span>
            <span className="text-lg font-black text-slate-900">{terminal.power}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Plug / Conector</span>
            <span className="text-xs font-bold text-slate-800 block truncate" title={terminal.connector}>
              {terminal.connector}
            </span>
          </div>
        </div>

        {/* Official Physical Label Specification Banner */}
        <div className="mb-5 p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Etiqueta Física da Fonte (Padrão PSU)</span>
              <span className="text-slate-600">{psuInfo.labelDescription}</span>
            </div>
          </div>
          <span 
            className={`px-4 py-1.5 rounded-md font-black text-xs tracking-wider uppercase shadow-xs shrink-0 border ${psuInfo.badgeBg} ${psuInfo.badgeText}`}
            style={psuInfo.customStyle}
          >
            {psuInfo.displayTag}
          </span>
        </div>

        {/* Power Supplies List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Modelos de Fontes Homologadas ({terminal.powerSupplies.length})</span>
            </h3>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {terminal.powerSupplies.map((ps) => (
              <div 
                key={ps.id}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-base text-slate-900">{ps.model}</span>
                      {ps.isAlternative && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium border border-amber-200">
                          Homologada Engenharia
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                      <p><span className="text-slate-500">Fabricante:</span> <strong className="text-slate-800">{ps.manufacturer}</strong></p>
                      {ps.partNumber && ps.partNumber !== 'N/A' && (
                        <p><span className="text-slate-500">P/N:</span> <code className="text-slate-800 font-mono">{ps.partNumber}</code></p>
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
                          : 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-xs'
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
                  <div className="mt-2 text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{ps.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Notice */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-red-600" />
            <span>Rede HFC / Fibra Claro</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
