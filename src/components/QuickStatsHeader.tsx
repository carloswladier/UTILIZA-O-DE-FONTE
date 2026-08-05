import React, { useState } from 'react';
import { Cpu, Zap, Hash, ShieldCheck, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { TERMINALS_DATA } from '../data/terminalsData';
import { PSU_LABEL_STANDARDS } from '../utils/psuLabels';

export const QuickStatsHeader: React.FC = () => {
  const [showPsuTable, setShowPsuTable] = useState(false);
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
    <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-6 mb-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-red-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>Documentação Oficial Claro - GRQ & Planejamento de Materiais</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Book de Fontes & Compatibilidade de Terminais
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Insira o modelo do terminal, roteador, decodificador ou ONT para visualizar todas as fontes homologadas, códigos SAP, conectores e especificações elétricas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <div className="text-center px-2">
              <div className="flex items-center justify-center space-x-1 text-slate-500 text-xs mb-0.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-red-600" />
                <span>Terminais</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-900">{totalTerminals}</span>
            </div>

            <div className="text-center px-2 border-x border-slate-200">
              <div className="flex items-center justify-center space-x-1 text-slate-500 text-xs mb-0.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Modelos Fonte</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-900">{totalPowerSupplies}</span>
            </div>

            <div className="text-center px-2">
              <div className="flex items-center justify-center space-x-1 text-slate-500 text-xs mb-0.5 font-medium">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cód. SAP</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-900">{sapSet.size}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPsuTable(!showPsuTable)}
            className="flex items-center justify-center space-x-2 px-3.5 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
          >
            <Tag className="w-4 h-4 text-red-600" />
            <span>Padrão de Etiquetas</span>
            {showPsuTable ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Expandable PSU Label Standard Table */}
      {showPsuTable && (
        <div className="mt-5 pt-5 border-t border-slate-200 animate-fade-in">
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
              Especificações das Fontes (PSU) – Padrão de Etiquetas
            </h3>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-600">
                <tr>
                  <th className="px-4 py-2.5">Especificação da Fonte</th>
                  <th className="px-4 py-2.5">Padrão da Etiqueta</th>
                  <th className="px-4 py-2.5 text-center">Etiqueta Visual (Física)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {PSU_LABEL_STANDARDS.map((std, i) => (
                  <tr key={i} className="hover:bg-white transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-900">
                      {std.voltage} – {std.current} ({std.power})
                    </td>
                    <td className="px-4 py-2.5">{std.labelDescription}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span 
                        className={`inline-block px-5 py-1.5 rounded-md font-black text-sm tracking-wider uppercase shadow-xs ${std.badgeBg} ${std.badgeText}`}
                        style={std.customStyle}
                      >
                        {std.displayTag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

