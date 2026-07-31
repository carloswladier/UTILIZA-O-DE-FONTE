import React from 'react';
import { BookOpen, HelpCircle, CheckCircle, ShieldAlert, Cpu, Zap, Cable } from 'lucide-react';

export const TechnicalGuideTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-extrabold text-white">Método de Pesquisa e Guia de Conectores</h2>
        </div>
        <p className="text-sm text-slate-300">
          Orientações da equipe de GRQ - Gestão de Reparos e Qualidade e Planejamento de Materiais da Claro NET.
        </p>
      </div>

      {/* 3 Step Search Method */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-start space-x-3">
          <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0">1</span>
          <div>
            <h3 className="font-bold text-white text-sm mb-1">Verificar Tensão e Corrente</h3>
            <p className="text-xs text-slate-400">
              Exemplo: <strong className="text-slate-200">12V e 4A (48W)</strong> ou <strong className="text-slate-200">12V e 1,5A (18W)</strong> no rótulo da fonte.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-start space-x-3">
          <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0">2</span>
          <div>
            <h3 className="font-bold text-white text-sm mb-1">Modelo da Fonte</h3>
            <p className="text-xs text-slate-400">
              Exemplo: <strong className="text-slate-200">ADP-50BR A</strong>, <strong className="text-slate-200">MU06-B050120-D1</strong>, <strong className="text-slate-200">H196A</strong>.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-start space-x-3">
          <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0">3</span>
          <div>
            <h3 className="font-bold text-white text-sm mb-1">Part Number (P/N) & SAP</h3>
            <p className="text-xs text-slate-400">
              Exemplo: <strong className="text-slate-200">DT1240WIC81B</strong>, Cód. SAP: <strong className="text-red-400">22056502</strong>. Alguns modelos não possuem P/N.
            </p>
          </div>
        </div>
      </div>

      {/* Voltage Table Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Tabela de Especificações de Tensão, Corrente e Potência (Book Claro)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tensão (V)</th>
                <th className="py-3 px-4">Corrente (A)</th>
                <th className="py-3 px-4">Potência (W)</th>
                <th className="py-3 px-4">Plug / Conector Tipico</th>
                <th className="py-3 px-4">Exemplos de Terminais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-red-400">5V</td>
                <td className="py-3 px-4 font-semibold text-slate-100">1,2A</td>
                <td className="py-3 px-4">6W</td>
                <td className="py-3 px-4 font-mono">4.0 x 1.7 mm</td>
                <td className="py-3 px-4">DCI106</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-red-400">9V</td>
                <td className="py-3 px-4 font-semibold text-slate-100">0,8A / 1A</td>
                <td className="py-3 px-4">7W - 9W</td>
                <td className="py-3 px-4 font-mono">5.5 x 2.1 mm</td>
                <td className="py-3 px-4">DCM425, DCI1000</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-red-400">12V</td>
                <td className="py-3 px-4 font-semibold text-slate-100">0,75A / 1A / 1,25A</td>
                <td className="py-3 px-4">9W - 15W</td>
                <td className="py-3 px-4 font-mono">5.5 x 2.1 mm, Plug Quadrado 8 Pinos</td>
                <td className="py-3 px-4">DPC2100, TC7110, SBV5121, DHG544, H196A</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-red-400">12V</td>
                <td className="py-3 px-4 font-semibold text-slate-100">1,5A / 2A</td>
                <td className="py-3 px-4">18W - 24W</td>
                <td className="py-3 px-4 font-mono">5.5x2.5mm / Pino Interno 5.5x3.2mm</td>
                <td className="py-3 px-4">S4KW3, S4KCW3, DCR7121, FAST3184, F6645P, F680 V5</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-red-400">12V</td>
                <td className="py-3 px-4 font-semibold text-slate-100">2,5A / 3A / 3,5A / 3,8A / 4A</td>
                <td className="py-3 px-4">30W - 48W</td>
                <td className="py-3 px-4 font-mono">Pino Interno 5.5x3.2mm / 6.5x3.0mm (+Cabo)</td>
                <td className="py-3 px-4">HNB100, TG1692, CGA4233, CG3000, FAST3890, HNB200, HGJ310</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-red-400">14V</td>
                <td className="py-3 px-4 font-semibold text-slate-100">1,7A</td>
                <td className="py-3 px-4">24W</td>
                <td className="py-3 px-4 font-mono">5.5 x 2.5 mm</td>
                <td className="py-3 px-4">SVG1501</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-red-400">15V</td>
                <td className="py-3 px-4 font-semibold text-slate-100">1A / 1,5A / 1,6A</td>
                <td className="py-3 px-4">15W - 24W</td>
                <td className="py-3 px-4 font-mono">4.0x1.7mm, 4.8x1.7mm</td>
                <td className="py-3 px-4">DPC2434, DPC3928, DPC3925, DWG850</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Power Cables Reference */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
          <Cable className="w-5 h-5 text-amber-400" />
          <span>Cabos de Força em Separado (115V - 240V)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Algumas fontes de maior potência (ex: 12V 3,8A e 12V 4A) exigem a solicitação do cabo de força separadamente do código da fonte.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="font-bold text-white block mb-1">Cabo de Força 250V 2.5A 2MT</span>
            <span className="text-red-400 font-bold block">SAP: 22026096</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Padrão bipolar 2 pinos 2 metros</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="font-bold text-white block mb-1">Cabo PP 2 x 0.75mm x 2MT</span>
            <span className="text-red-400 font-bold block">SAP: 22026099</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Cabo flexível reforçado PP</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="font-bold text-white block mb-1">Cabo 2P+T Padrão Novo</span>
            <span className="text-red-400 font-bold block">SAP: 22026102</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Padrão com pino de terra (NBR 14136)</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="font-bold text-white block mb-1">Cabo P/ Fonte EMTA S.A</span>
            <span className="text-red-400 font-bold block">SAP: 22026105</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Específico para fontes EMTA S.A</span>
          </div>
        </div>
      </div>
    </div>
  );
};
