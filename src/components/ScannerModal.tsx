import React, { useState, useRef, useMemo } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Zap, Copy, Tag } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { recognize } from 'tesseract.js';
import { TERMINALS_DATA } from '../data/terminalsData';
import { Terminal } from '../types';
import { getPsuLabelInfo } from '../utils/psuLabels';

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

  const runClientGemini = async (imageBase64: string | null, text: string) => {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('Sem chave VITE_GEMINI_API_KEY no cliente');

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é um especialista técnico sênior de equipamentos e infraestrutura Claro NET (Book de Fontes & Terminais).
Sua tarefa é analisar ${imageBase64 ? 'a foto do rótulo/etiqueta da fonte de alimentação ou do terminal' : 'o texto informado pelo usuário: ' + text} e extrair com máxima precisão os seguintes dados:
1. modeloFonte (Modelo impresso na fonte ou no terminal, ex: MSG-V1500WR120-018I1-BR, MU06-B050120-D1, ADP-50BR, H196A, DCI106, S4KW3, etc.)
2. sapCode (Código SAP de 8 dígitos se houver na etiqueta, ex: 22026278, 22062068, 22062575, etc.)
3. tensao (Tensão em Volts, ex: 5V, 9V, 12V, 14V, 15V)
4. corrente (Corrente em Amperes, ex: 1.2A, 1.5A, 2A, 2.5A, 3A, 4A)
5. fabricante (Fabricante/Marca, ex: Sagemcom, MOSO, MEIC, LITE ON, NETBIT, AC BEL, FLEX INDUSTRIES)
6. partNumber (Part Number ou P/N, ex: 191698791-XX, 191600845-XX, DT1240WIC81B, LT1215WWBR1B)
7. modeloTerminalSugerido (Modelos de receptores/terminais Claro NET conhecidos por usar essa fonte/P/N. Exemplo: para fontes Sagemcom/MOSO 12V 1.5A P/N 191698791-XX ou MSG-V1500WR120, o terminal é "S4KW3 / S4KCW3 / S4KCW5")
8. resumoExplicativo (Um resumo curto e direto de 2 frases informando o tipo de fonte, P/N identificado e para quais equipamentos da Claro NET ela é destinada).

Responda ESTRITAMENTE em formato JSON valido com os campos:
{
  "modeloFonte": "...",
  "sapCode": "...",
  "tensao": "...",
  "corrente": "...",
  "fabricante": "...",
  "partNumber": "...",
  "modeloTerminalSugerido": "...",
  "resumoExplicativo": "..."
}`;

    let contents: any[] = [];
    if (imageBase64) {
      let detectedMimeType = 'image/jpeg';
      let cleanBase64 = imageBase64;
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMimeType = match[1];
        cleanBase64 = match[2];
      } else {
        cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      }

      contents = [
        prompt,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: detectedMimeType
          }
        }
      ];
    } else {
      contents = [prompt];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Sem resposta da IA no cliente");

    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  };

  const runClientOcrAndMatch = async (imageBase64: string | null, text: string) => {
    let ocrText = '';
    if (imageBase64) {
      try {
        const res = await recognize(imageBase64, 'eng');
        ocrText = res.data.text || '';
      } catch (e) {
        console.warn('OCR em tempo de execução falhou:', e);
      }
    }

    const combinedText = (ocrText + ' ' + text).trim();
    const cleanAlpha = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQ = cleanAlpha(combinedText);

    if (!cleanQ) {
      return {
        modeloFonte: 'Não identificado',
        sapCode: 'N/A',
        tensao: 'N/A',
        corrente: 'N/A',
        fabricante: 'N/A',
        partNumber: 'N/A',
        modeloTerminalSugerido: 'N/A',
        resumoExplicativo: 'Por favor, envie uma foto legível da etiqueta ou digite o P/N no campo de busca.'
      };
    }

    let bestMatch: { terminal: Terminal; ps: any; score: number } | null = null;
    let maxScore = 0;

    for (const t of TERMINALS_DATA) {
      for (const ps of t.powerSupplies) {
        let score = 0;

        // 1. SAP Code match (110 pts)
        if (ps.sapCode && ps.sapCode.length >= 6 && cleanQ.includes(ps.sapCode)) {
          score += 110;
        }

        // 2. Part Number match (100 pts)
        if (ps.partNumber && ps.partNumber !== 'N/A') {
          const psPnClean = cleanAlpha(ps.partNumber);
          const corePnMatch = ps.partNumber.match(/\d{7,10}/);
          if (psPnClean.length >= 5 && cleanQ.includes(psPnClean)) {
            score += 100;
          } else if (corePnMatch && cleanQ.includes(corePnMatch[0])) {
            score += 95;
          }
        }

        // 3. Model match (85 pts)
        if (ps.model) {
          const modelClean = cleanAlpha(ps.model);
          if (modelClean.length >= 5 && cleanQ.includes(modelClean)) {
            score += 85;
          } else {
            const parts = ps.model.split(/[\s-]/);
            for (const p of parts) {
              const pClean = cleanAlpha(p);
              if (pClean.length >= 6 && cleanQ.includes(pClean)) {
                score += 50;
                break;
              }
            }
          }
        }

        // 4. Voltage + Current match (40 pts)
        const vClean = t.voltage.replace(/[^\d]/g, '');
        const cClean = t.current.replace(',', '.').replace(/[^\d.]/g, '');

        const hasVoltage = combinedText.match(new RegExp(`\\b${vClean}\\.?0?\\s*v`, 'i'));
        const hasCurrent = combinedText.match(new RegExp(`\\b${cClean.replace('.', '\\.')}\\s*a`, 'i'));

        if (hasVoltage && hasCurrent) {
          score += 40;
        }

        // 5. Manufacturer match (20 pts)
        if (ps.manufacturer) {
          const mfgParts = ps.manufacturer.split(/[\s/]/);
          for (const m of mfgParts) {
            const mClean = cleanAlpha(m);
            if (mClean.length >= 4 && cleanQ.includes(mClean)) {
              score += 20;
              break;
            }
          }
        }

        if (score > maxScore) {
          maxScore = score;
          bestMatch = { terminal: t, ps, score };
        }
      }
    }

    // Extract raw regex fields from OCR text for fallback DISPLAY
    const detectedVoltageMatch = combinedText.match(/(\d{1,2}(?:\.\d)?)\s*V(?:DC)?/i);
    const detectedCurrentMatch = combinedText.match(/(\d{1,2}(?:\.\d)?)\s*A\b/i);
    const detectedPnMatch = combinedText.match(/(?:P\/N|PN|PART\s*NUMBER)[:\s]*([A-Z0-9-]+)/i) || combinedText.match(/\b(\d{9}(?:-[A-Z0-9]+)?)\b/);
    const detectedModelMatch = combinedText.match(/(?:MODELO|MODEL|MOD)[:\s]*([A-Z0-9-]+)/i);
    const detectedMfgMatch = combinedText.match(/\b(SAGEMCOM|MOSO|NETBIT|FLEX|LITE\s*ON|AC\s*BEL|HUNTKEY|LEADER|DELTA)\b/i);

    if (bestMatch && maxScore >= 35) {
      const { terminal, ps } = bestMatch;
      return {
        modeloFonte: ps.model || 'Fonte Homologada Claro NET',
        sapCode: ps.sapCode || 'N/A',
        tensao: terminal.voltage,
        corrente: terminal.current,
        fabricante: ps.manufacturer || (detectedMfgMatch ? detectedMfgMatch[1].toUpperCase() : 'Fabricante Homologado'),
        partNumber: ps.partNumber !== 'N/A' ? ps.partNumber : (detectedPnMatch ? detectedPnMatch[1] : 'N/A'),
        modeloTerminalSugerido: terminal.name,
        resumoExplicativo: `Reconhecido da imagem: Fonte ${ps.model} (P/N: ${ps.partNumber}, SAP: ${ps.sapCode}) homologada para o equipamento ${terminal.name} (${terminal.voltage} ${terminal.current}).`
      };
    } else {
      return {
        modeloFonte: detectedModelMatch ? detectedModelMatch[1] : 'Modelo não cadastrado no Book',
        sapCode: 'Verificar etiqueta',
        tensao: detectedVoltageMatch ? `${detectedVoltageMatch[1]}V` : 'N/A',
        corrente: detectedCurrentMatch ? `${detectedCurrentMatch[1]}A` : 'N/A',
        fabricante: detectedMfgMatch ? detectedMfgMatch[1].toUpperCase() : 'Não identificado',
        partNumber: detectedPnMatch ? detectedPnMatch[1] : 'N/A',
        modeloTerminalSugerido: 'Não encontrado no Book',
        resumoExplicativo: `Leitura local via OCR concluída. Tensão lida: ${detectedVoltageMatch ? detectedVoltageMatch[1]+'V' : '?'}, Corrente: ${detectedCurrentMatch ? detectedCurrentMatch[1]+'A' : '?'}, P/N: ${detectedPnMatch ? detectedPnMatch[1] : '?'}. Digite o P/N no campo se necessário.`
      };
    }
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

      let dataResult: any = null;

      // 1. Tenta comunicar com o backend Node.js se existente (/api/analyze-font)
      try {
        const response = await fetch('/api/analyze-font', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: finalImage,
            textQuery: textQuery.trim()
          })
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.result && (data.result.modeloFonte || data.result.partNumber || data.result.sapCode)) {
            dataResult = data.result;
          }
        }
      } catch (serverErr) {
        console.warn('Backend server /api/analyze-font indisponível:', serverErr);
      }

      // 2. Se o backend não respondeu (ex: hospedagem estática no Hostinger com 404), tenta o Gemini diretamente via cliente
      if (!dataResult) {
        try {
          dataResult = await runClientGemini(finalImage, textQuery.trim());
        } catch (clientErr) {
          console.warn('Gemini via cliente não disponível:', clientErr);
        }
      }

      // 3. OCR local via Tesseract.js e busca inteligente no Book de Fontes
      if (!dataResult) {
        dataResult = await runClientOcrAndMatch(finalImage, textQuery.trim());
      }

      setAiResult(dataResult);
    } catch (err: any) {
      setError(err.message || 'Erro ao analisar rótulo.');
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs my-6 text-slate-900">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <span>Leitor Inteligente de Etiquetas de Fonte (IA)</span>
            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">Gemini AI</span>
          </h2>
          <p className="text-xs text-slate-500">
            Fotografe a etiqueta da fonte de alimentação ou digite o texto do rótulo para identificar o Código SAP e Terminais Compatíveis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Input Column */}
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/80 transition-all flex flex-col items-center justify-center min-h-[220px]"
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
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-600">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Clique para tirar foto ou selecionar imagem
                </p>
                <p className="text-xs text-slate-500">
                  Fotografe a etiqueta contendo Tensão (ex: 12V 2A), Modelo ou Cód. SAP
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ou digite os dados da etiqueta manualmente:
            </label>
            <input
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="Ex: ADP-50BR, 12V 4A, SAP 22056502, MU06-B050120..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || (!selectedImage && !textQuery.trim())}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
              loading || (!selectedImage && !textQuery.trim())
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
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
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm border-b border-slate-200 pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Análise de Etiqueta Concluída</span>
              </div>

              {/* Extracted Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Modelo Identificado</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block" title={aiResult.modeloFonte || ''}>
                    {aiResult.modeloFonte || 'Não detectado'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Part Number (P/N)</span>
                  <span className="font-mono font-bold text-amber-700 text-xs sm:text-sm truncate block" title={aiResult.partNumber || ''}>
                    {aiResult.partNumber || 'Não impresso'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Código SAP</span>
                  <span className="font-bold text-red-600 text-xs sm:text-sm truncate block">
                    {resolvedSapCode}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tensão & Corrente</span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      {aiResult.tensao || 'N/D'} {aiResult.corrente ? `• ${aiResult.corrente}` : ''}
                    </span>
                    {aiResult.tensao && (
                      <span 
                        className={`text-[10px] px-1.5 py-0.5 rounded font-black border ${getPsuLabelInfo(aiResult.tensao, aiResult.corrente || '').badgeBg} ${getPsuLabelInfo(aiResult.tensao, aiResult.corrente || '').badgeText}`}
                        style={getPsuLabelInfo(aiResult.tensao, aiResult.corrente || '').customStyle}
                      >
                        {getPsuLabelInfo(aiResult.tensao, aiResult.corrente || '').displayTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fabricante</span>
                  <span className="font-bold text-slate-700 text-xs sm:text-sm truncate block">
                    {aiResult.fabricante || 'Não detectado'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Terminal Sugerido</span>
                  <span className="font-bold text-emerald-700 text-xs truncate block" title={aiResult.modeloTerminalSugerido || ''}>
                    {aiResult.modeloTerminalSugerido || 'Identificado no Book'}
                  </span>
                </div>
              </div>

              {aiResult.resumoExplicativo && (
                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {aiResult.resumoExplicativo}
                </p>
              )}

              {/* Matched Terminals */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Terminais Compatíveis No Book ({matchedItems.length}):</span>
                  </span>
                </div>

                {matchedItems.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {matchedItems.map(({ terminal, score, matchReasons, matchedPowerSupply }) => (
                      <div 
                        key={terminal.id}
                        className="bg-white hover:bg-slate-100/60 p-3 rounded-xl border border-slate-200 hover:border-red-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="font-bold text-sm text-slate-900">{terminal.name}</span>
                            <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">
                              {terminal.voltage} ({terminal.power})
                            </span>
                            {score >= 80 && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                                Match Perfeito
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            <p className="text-[11px] text-slate-700 font-medium">
                              {terminal.category}
                            </p>
                            {matchedPowerSupply && (
                              <p className="text-[11px] text-slate-600 font-mono">
                                Fonte Homologada: {matchedPowerSupply.model} | P/N: {matchedPowerSupply.partNumber} | SAP: <strong className="text-red-600 font-bold">{matchedPowerSupply.sapCode}</strong>
                              </p>
                            )}
                            {matchReasons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {matchReasons.map((reason, idx) => (
                                  <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                    {reason}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectTerminal(terminal)}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shrink-0 shadow-xs"
                        >
                          <span>Ver Ficha Técnica</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-white rounded-xl border border-slate-200 text-center">
                    Nenhum terminal exato encontrado para estes parâmetros.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center h-full flex flex-col items-center justify-center text-slate-500">
              <Zap className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
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
