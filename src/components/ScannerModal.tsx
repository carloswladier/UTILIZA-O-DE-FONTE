import React, { useState, useRef, useMemo } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Zap, Copy } from 'lucide-react';
import { TERMINALS_DATA } from '../data/terminalsData';
import { Terminal } from '../types';

interface ScannerModalProps {
  onSelectTerminal: (terminal: Terminal) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ onSelectTerminal }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (dataUrl: string, maxWidth = 1600, maxHeight = 1600): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const rawDataUrl = reader.result as string;
      try {
        const compressed = await resizeImage(rawDataUrl, 1600, 1600);
        setSelectedImage(compressed);
      } catch (err) {
        setSelectedImage(rawDataUrl);
      }
      setError(null);
      setAiResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !textQuery.trim()) {
      setError('Por favor, carregue uma foto da etiqueta ou digite o código/modelo.');
      return;
    }

    setLoading(true);
    setError(null);
    setAiResult(null);

    try {
      let finalImage = selectedImage;
      if (selectedImage && selectedImage.length > 500000) {
        finalImage = await resizeImage(selectedImage, 1200, 1200);
      }

      const response = await fetch('/api/analyze-font', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: finalImage,
          textQuery: textQuery.trim()
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = {};

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const responseText = await response.text();
        console.error('Resposta não-JSON do servidor:', responseText);
        if (response.status === 413) {
          throw new Error('A imagem é muito grande para o servidor. Escolha uma foto com tamanho menor.');
        } else if (response.status === 404) {
          throw new Error('Endpoint da IA não encontrado (404). Se o aplicativo estiver hospedado no Hostinger ou servidor estático, o backend Node.js (server.ts) precisa estar rodando.');
        } else {
          throw new Error(`Erro no servidor (Status ${response.status}). Verifique a conexão com o backend.`);
        }
      }

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Falha ao analisar rótulo.');
      }

      setAiResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Erro de comunicação com o servidor de IA.');
    } finally {
      setLoading(false);
    }
  };

  // Advanced Match Engine: Match AI extracted fields against local TERMINALS_DATA with scoring
  const getMatchedTerminals = () => {
    if (!aiResult) return [];

    const searchSap = aiResult.sapCode?.trim();
    const searchModel = aiResult.modeloFonte?.trim().toLowerCase();
    const searchVoltage = aiResult.tensao?.trim().toLowerCase();
    const searchCurrent = aiResult.corrente?.trim().toLowerCase();
    const searchTerminal = aiResult.modeloTerminalSugerido?.trim().toLowerCase();
    const searchPn = aiResult.partNumber?.trim().toLowerCase();
    const searchManufacturer = aiResult.fabricante?.trim().toLowerCase();

    // Helper to clean alphanumeric string
    const cleanAlpha = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const searchPnClean = searchPn ? cleanAlpha(searchPn) : '';
    const searchModelClean = searchModel ? cleanAlpha(searchModel) : '';

    const scoredResults: {
      terminal: Terminal;
      score: number;
      matchReasons: string[];
      matchedPowerSupply?: any;
    }[] = [];

    TERMINALS_DATA.forEach((t) => {
      let bestPsScore = 0;
      let bestReasons: string[] = [];
      let bestPs: any = null;

      t.powerSupplies.forEach((ps) => {
        let psScore = 0;
        const psReasons: string[] = [];

        // 1. Part Number Match (Highest Weight)
        if (searchPnClean && searchPnClean.length >= 4 && ps.partNumber && ps.partNumber !== 'N/A') {
          const psPnClean = cleanAlpha(ps.partNumber);
          if (psPnClean.length >= 4) {
            if (psPnClean === searchPnClean || psPnClean.includes(searchPnClean) || searchPnClean.includes(psPnClean)) {
              psScore += 100;
              psReasons.push(`P/N Exato: ${ps.partNumber}`);
            } else if (psPnClean.slice(0, 7) === searchPnClean.slice(0, 7)) {
              psScore += 85;
              psReasons.push(`P/N Compatível: ${ps.partNumber}`);
            }
          }
        }

        // 2. Power Supply Model Match
        if (searchModelClean && searchModelClean.length >= 4) {
          const psModelClean = cleanAlpha(ps.model);
          if (psModelClean.length >= 4) {
            if (psModelClean === searchModelClean || psModelClean.includes(searchModelClean) || searchModelClean.includes(psModelClean)) {
              psScore += 90;
              psReasons.push(`Modelo de Fonte: ${ps.model}`);
            } else {
              // Partial model match (e.g., MSG-V1500WR120 stem)
              const stem1 = searchModelClean.slice(0, 10);
              const stem2 = psModelClean.slice(0, 10);
              if (stem1.length >= 6 && psModelClean.includes(stem1)) {
                psScore += 70;
                psReasons.push(`Série de Fonte Compatível: ${ps.model}`);
              }
            }
          }
        }

        // 3. SAP Code Match
        if (searchSap && ps.sapCode && ps.sapCode !== 'Sem SAP') {
          if (ps.sapCode.includes(searchSap) || searchSap.includes(ps.sapCode)) {
            psScore += 95;
            psReasons.push(`SAP de Estoque: ${ps.sapCode}`);
          }
        }

        // 4. Manufacturer Match
        if (searchManufacturer && ps.manufacturer) {
          const m1 = searchManufacturer.toLowerCase();
          const m2 = ps.manufacturer.toLowerCase();
          if (m1.includes(m2) || m2.includes(m1) || (m1.includes('sagemcom') && m2.includes('moso'))) {
            psScore += 10;
          }
        }

        if (psScore > bestPsScore) {
          bestPsScore = psScore;
          bestReasons = psReasons;
          bestPs = ps;
        }
      });

      // 5. Terminal Name / ID Match
      if (searchTerminal && searchTerminal.length >= 2) {
        const tName = t.name.toLowerCase();
        const tId = t.id.toLowerCase();
        
        // Extract words like S4KW3, S4KCW3, DCI106, H196A
        const words = searchTerminal.split(/[\s\/,-]+/);
        for (const w of words) {
          if (w.length >= 3 && (tName.includes(w) || tId.includes(w))) {
            bestPsScore += 65;
            bestReasons.push(`Terminal Compatível: ${t.name}`);
            break;
          }
        }
      }

      // 6. Electrical Specification Match (Voltage + Current)
      if (searchVoltage) {
        const tVolt = t.voltage.toLowerCase().replace(/\s/g, '');
        const sVolt = searchVoltage.toLowerCase().replace(/\s/g, '');
        if (tVolt === sVolt) {
          if (searchCurrent) {
            const tCurr = t.current.toLowerCase().replace(/[^0-9,.]/g, '').replace(',', '.');
            const sCurr = searchCurrent.toLowerCase().replace(/[^0-9,.]/g, '').replace(',', '.');
            if (tCurr === sCurr) {
              bestPsScore += 20;
              bestReasons.push(`Elétrica (12V 1.5A)`);
            } else {
              bestPsScore += 5;
            }
          } else {
            bestPsScore += 5;
          }
        }
      }

      if (bestPsScore > 0) {
        scoredResults.push({
          terminal: t,
          score: bestPsScore,
          matchReasons: bestReasons,
          matchedPowerSupply: bestPs
        });
      }
    });

    // Sort by score descending
    scoredResults.sort((a, b) => b.score - a.score);

    // If we have strong matches (score >= 40), filter out low-score electrical fallbacks
    const hasStrongMatches = scoredResults.some(r => r.score >= 40);
    const finalMatches = hasStrongMatches 
      ? scoredResults.filter(r => r.score >= 40)
      : scoredResults;

    return finalMatches;
  };

  const matchedItems = getMatchedTerminals();

  // Auto-resolve SAP code from top matched power supply if Gemini didn't extract one
  const resolvedSapCode = useMemo(() => {
    if (aiResult?.sapCode && aiResult.sapCode !== 'Não detectado' && aiResult.sapCode !== 'Sem SAP') {
      return aiResult.sapCode;
    }
    if (matchedItems.length > 0 && matchedItems[0].matchedPowerSupply?.sapCode) {
      return `${matchedItems[0].matchedPowerSupply.sapCode} (do Book)`;
    }
    return 'Não cadastrado no rótulo';
  }, [aiResult, matchedItems]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl my-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <span>Leitor Inteligente de Etiquetas de Fonte (IA)</span>
            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">Gemini AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            Fotografe a etiqueta da fonte de alimentação ou digite o texto do rótulo para identificar o Código SAP e Terminais Compatíveis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Input Column */}
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-red-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all flex flex-col items-center justify-center min-h-[220px]"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden" 
            />

            {selectedImage ? (
              <div className="relative w-full max-h-52 overflow-hidden rounded-xl">
                <img src={selectedImage} alt="Foto da Fonte" className="w-full h-full object-contain mx-auto" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  Trocar Imagem
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-200">
                  Clique para tirar foto ou selecionar imagem
                </p>
                <p className="text-xs text-slate-400">
                  Fotografe a etiqueta contendo Tensão (ex: 12V 2A), Modelo ou Cód. SAP
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ou digite os dados da etiqueta manualmente:
            </label>
            <input
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="Ex: ADP-50BR, 12V 4A, SAP 22056502, MU06-B050120..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {error && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || (!selectedImage && !textQuery.trim())}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
              loading || (!selectedImage && !textQuery.trim())
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Analisando rótulo com Inteligência Artificial...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Analisar Etiqueta & Encontrar Compatíveis</span>
              </>
            )}
          </button>
        </div>

        {/* AI Results Column */}
        <div>
          {aiResult ? (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Análise de Etiqueta Concluída</span>
              </div>

              {/* Extracted Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Modelo Identificado</span>
                  <span className="font-bold text-white text-xs sm:text-sm truncate block" title={aiResult.modeloFonte || ''}>
                    {aiResult.modeloFonte || 'Não detectado'}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Part Number (P/N)</span>
                  <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm truncate block" title={aiResult.partNumber || ''}>
                    {aiResult.partNumber || 'Não impresso'}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Código SAP</span>
                  <span className="font-bold text-red-400 text-xs sm:text-sm truncate block">
                    {resolvedSapCode}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tensão & Corrente</span>
                  <span className="font-bold text-slate-200 text-xs sm:text-sm">
                    {aiResult.tensao || 'N/D'} {aiResult.corrente ? `• ${aiResult.corrente}` : ''}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fabricante</span>
                  <span className="font-bold text-slate-300 text-xs sm:text-sm truncate block">
                    {aiResult.fabricante || 'Não detectado'}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Terminal Sugerido</span>
                  <span className="font-bold text-emerald-400 text-xs truncate block" title={aiResult.modeloTerminalSugerido || ''}>
                    {aiResult.modeloTerminalSugerido || 'Identificado no Book'}
                  </span>
                </div>
              </div>

              {aiResult.resumoExplicativo && (
                <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {aiResult.resumoExplicativo}
                </p>
              )}

              {/* Matched Terminals */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Terminais Compatíveis No Book ({matchedItems.length}):</span>
                  </span>
                </div>

                {matchedItems.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {matchedItems.map(({ terminal, score, matchReasons, matchedPowerSupply }) => (
                      <div 
                        key={terminal.id}
                        className="bg-slate-900 hover:bg-slate-850 p-3 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="font-bold text-sm text-white">{terminal.name}</span>
                            <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-bold border border-red-800/60">
                              {terminal.voltage} ({terminal.power})
                            </span>
                            {score >= 80 && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                                Match Perfeito
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                            <p className="text-[11px] text-slate-300 font-medium">
                              {terminal.category}
                            </p>
                            {matchedPowerSupply && (
                              <p className="text-[11px] text-amber-300/90 font-mono">
                                Fonte Homologada: {matchedPowerSupply.model} | P/N: {matchedPowerSupply.partNumber} | SAP: <strong className="text-red-400 font-bold">{matchedPowerSupply.sapCode}</strong>
                              </p>
                            )}
                            {matchReasons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {matchReasons.map((reason, idx) => (
                                  <span key={idx} className="text-[9px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                                    {reason}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectTerminal(terminal)}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shrink-0 shadow-sm"
                        >
                          <span>Ver Ficha Técnica</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-900/50 rounded-xl text-center">
                    Nenhum terminal exato encontrado para estes parâmetros. Tente buscar pelo termo geral na aba "Por Fonte / SAP".
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 rounded-2xl border border-slate-800/60 p-8 text-center h-full flex flex-col items-center justify-center text-slate-500">
              <Zap className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-slate-400">
                Aguardando leitura do rótulo
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Faça o upload de uma imagem da fonte ou digite a especificação para obter a análise automática por IA.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
