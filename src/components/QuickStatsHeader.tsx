import React from 'react';
import { Cpu, Zap, Hash, ShieldCheck } from 'lucide-react';
import { TERMINALS_DATA } from '../data/terminalsData';

export const QuickStatsHeader: React.FC = () => {
  const totalTerminals = TERMINALS_DATA.length;
  
  // Calculate unique power supplies and SAP codes
  const allPowerSupplies = TERMINALS_DATA.flatMap(t => t.powerSupplies);
  const totalPowerSupplies = allPowerSupplies.length;
  
  const sapSet = new Set(
    allPowerSupplies
      .map(p => p.sapCode.trim())
      .filter(sap => sap && sap !== 'Sem SAP' && sap !== 'SEM cadastro SAP')
  );

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-6 mb-8 border border-slate-700/60 shadow-lg relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Documentação Oficial Claro NET - GRQ & Planejamento de Materiais</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Book de Fontes & Compatibilidade de Terminais
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Insira o modelo do terminal, roteador, decodificador ou ONT para visualizar todas as fontes homologadas, códigos SAP, conectores e especificações elétricas.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-center px-2">
            <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs mb-0.5">
              <Cpu className="w-3.5 h-3.5 text-red-400" />
              <span>Terminais</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-white">{totalTerminals}</span>
          </div>

          <div className="text-center px-2 border-x border-slate-800">
            <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs mb-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Modelos Fonte</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-white">{totalPowerSupplies}</span>
          </div>

          <div className="text-center px-2">
            <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs mb-0.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cód. SAP</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-white">{sapSet.size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
