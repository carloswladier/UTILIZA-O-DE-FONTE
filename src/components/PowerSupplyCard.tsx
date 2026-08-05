import React, { useState } from 'react';
import { PowerSupply, Terminal } from '../types';
import { Zap, Copy, Check, Cpu, Info } from 'lucide-react';

interface PowerSupplyCardProps {
  powerSupply: PowerSupply & {
    terminals: Terminal[];
    voltage: string;
    current: string;
    power: string;
  };
  onSelectTerminal?: (terminal: Terminal) => void;
}

export const PowerSupplyCard: React.FC<PowerSupplyCardProps> = ({
  powerSupply,
  onSelectTerminal
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySap = () => {
    navigator.clipboard.writeText(powerSupply.sapCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-red-500/80 transition-all p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with SAP & Voltage */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs bg-red-50 text-red-700 font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                {powerSupply.voltage} ({powerSupply.power})
              </span>
              <span className="text-xs text-slate-500 font-medium">{powerSupply.current}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {powerSupply.model}
            </h3>
          </div>

          <button
            onClick={handleCopySap}
            disabled={powerSupply.sapCode === 'Sem SAP' || powerSupply.sapCode === 'SEM cadastro SAP'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-xs'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>SAP: {powerSupply.sapCode}</span>
          </button>
        </div>

        {/* Details Specs */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 mb-4">
          <p><span className="text-slate-500">Fabricante:</span> <strong className="text-slate-800">{powerSupply.manufacturer}</strong></p>
          {powerSupply.partNumber && powerSupply.partNumber !== 'N/A' && (
            <p><span className="text-slate-500">Part Number (P/N):</span> <code className="text-slate-800 font-mono">{powerSupply.partNumber}</code></p>
          )}
          {powerSupply.notes && (
            <p className="text-amber-900 text-[11px] pt-1 border-t border-slate-200 mt-1 flex items-center space-x-1">
              <Info className="w-3 h-3 text-amber-600 shrink-0 inline mr-1" />
              <span>{powerSupply.notes}</span>
            </p>
          )}
        </div>

        {/* Compatible Terminals Section */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5 text-red-600" />
            <span>Terminais Compatíveis ({powerSupply.terminals.length})</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {powerSupply.terminals.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTerminal?.(t)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center space-x-1"
                title={`Ver detalhes do terminal ${t.name}`}
              >
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
