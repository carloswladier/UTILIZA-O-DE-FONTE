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

  const enrichWithBookData = (data: any) => {
    if (!data) return data;

    const rawPn = (data.partNumber || '').trim();
    const rawModel = (data.modeloFonte || '').trim();
    const rawSap = (data.sapCode || '').trim();
    const rawVolt = (data.tensao || '').trim();
    const rawCurr = (data.corrente || '').trim();
    const rawMfg = (data.fabricante || '').trim();

    const cleanAlpha = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pnClean = cleanAlpha(rawPn);
    const modelClean = cleanAlpha(rawModel);
    const sapClean = cleanAlpha(rawSap);

    let bestMatch: { terminal: Terminal; ps: any; score: number } | null = null;
    let maxScore = 0;

    for (const t of TERMINALS_DATA) {
      for (const ps of t.powerSupplies) {
        let score = 0;

        // 1. SAP Match
        if (sapClean && sapClean.length >= 6 && ps.sapCode && cleanAlpha(ps.sapCode).includes(sapClean)) {
          score += 350;
        }

        // 2. Part Number Match
        if (ps.partNumber && ps.partNumber !== 'N/A') {
          const psPnClean = cleanAlpha(ps.partNumber);
          const corePn = ps.partNumber.match(/\d{7,10}/);
          if (pnClean && psPnClean && (psPnClean.includes(pnClean) || pnClean.includes(psPnClean))) {
            score += 300;
          } else if (corePn && pnClean.includes(corePn[0])) {
            score += 250;
          }
        }

        // 3. Model Match
        if (ps.model && modelClean && modelClean.length >= 4) {
          const psModelClean = cleanAlpha(ps.model);
          if (psModelClean.includes(modelClean) || modelClean.includes(psModelClean)) {
            score += 200;
          } else {
            const parts = ps.model.split(/[\s-]/);
            for (const p of parts) {
              const pClean = cleanAlpha(p);
              if (pClean.length >= 5 && modelClean.includes(pClean)) {
                score += 100;
                break;
              }
            }
          }
        }

        // 4. Electrical Match
        const tV = t.voltage.replace(/[^\d]/g, '');
        const tC = t.current.replace(',', '.').replace(/[^\d.]/g, '');
        const dV = rawVolt.replace(/[^\d]/g, '');
        const dC = rawCurr.replace(',', '.').replace(/[^\d.]/g, '');

        if (tV && dV && tV === dV) {
          if (tC && dC && Math.abs(parseFloat(tC) - parseFloat(dC)) < 0.2) {
            score += 150;
          } else if (dC && tC) {
            score -= 250; // Penalty for wrong current
          }
        } else if (tV && dV) {
          score -= 500; // Penalty for wrong voltage
        }

        // 5. Manufacturer Match
        if (ps.manufacturer && rawMfg) {
          const m1 = cleanAlpha(ps.manufacturer);
          const m2 = cleanAlpha(rawMfg);
          if (m1.includes(m2) || m2.includes(m1)) {
            score += 50;
          }
        }

        if (score > maxScore) {
          maxScore = score;
          bestMatch = { terminal: t, ps, score };
        }
      }
    }

    if (bestMatch && maxScore >= 100) {
      const { terminal, ps } = bestMatch;
      return {
        ...data,
        modeloFonte: ps.model || data.modeloFonte,
        sapCode: ps.sapCode || data.sapCode,
        tensao: terminal.voltage,
        corrente: terminal.current,
        fabricante: ps.manufacturer || data.fabricante,
        partNumber: ps.partNumber !== 'N/A' ? ps.partNumber : data.partNumber,
        modeloTerminalSugerido: terminal.name,
        resumoExplicativo: `Fonte ${ps.model} (P/N: ${ps.partNumber}, SAP: ${ps.sapCode}) homologada no Book da Claro para o equipamento ${terminal.name} (${terminal.voltage} ${terminal.current}).`
      };
    }

    return data;
  };

  const runClientGemini = async (imageBase64: string | null, text: string) => {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('Sem chave VITE_GEMINI_API_KEY no cliente');

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é um especialista em análise de etiquetas de fontes de alimentação de equipamentos da Claro (Book de Fontes & Terminais).
Examine a foto da etiqueta fornecida com extrema precisão visual e extraia os seguintes dados:

ORIENTAÇÕES DE LEITURA DA ETIQUETA:
1. FABRICANTE / MARCA: Identifique a marca no topo ou corpo da etiqueta (ex: Sagemcom, MOSO, MEIC, LITE ON, NETBIT, AC BEL, FLEX, SHENZHEN HONOR, FRECOM, TELLESCOM).
2. MODELO DA FONTE: Identifique o código do modelo exato (ex: MSG-H3-AGWR120-042A0-BR, MSG-H3500WR120-042A0-BR, MSG-V1500WR120-018I1-BR, ADS-42FKJ-12, NBS42E120350VB, MU06-B050120, etc.).
3. P/N (PART NUMBER): Localize a linha "P/N:", "P/N" ou o código alfanumérico no formato XXXXXXXXX-XX (ex: 191591509-XX, 191591517-XX, 191698791-XX, 01570610300R).
4. SAÍDA (TENSÃO & CORRENTE):
   - Veja as especificações de saída ("SAÍDA: 12.0V === 3.5A" ou a etiqueta colorida inferior ex: "12VDC 3.5A").
   - tensao: ex "12V", "20V", "5V", "9V"
   - corrente: ex "3.5A", "1.5A", "2A", "2.5A", "4A"
5. CÓDIGO SAP: Se houver código SAP de 8 dígitos impresso na etiqueta (ex: 22060652, 22063233), extraia-o. Se não houver, informe o SAP conhecido para este P/N.
6. TERMINAL SUGERIDO & RESUMO:
   - Identifique o equipamento/terminal Claro compatível (ex: para fonte Sagemcom/MOSO 12V 3.5A P/N 191591509-XX ou MSG-H3, os terminais são "FAST3895 / FAST3896" ou "CH8568" / "HI3120" / "WIFI7 MESH 380BA").
   - Escreva um resumo explicativo claro e direto de 2 frases.

Responda ESTRITAMENTE em formato JSON com os campos:
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
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Sem resposta da IA no cliente");

    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const rawParsed = JSON.parse(cleanedText);
    return enrichWithBookData(rawParsed);
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

    const rawCombined = (ocrText + ' ' + text).trim();
    // Normalize text to fix OCR glitches
    const normalizedText = rawCombined
      .replace(/Sagercom/gi, 'Sagemcom')
      .replace(/1915915O9/gi, '191591509')
      .replace(/191581509/gi, '191591509')
      .replace(/MSG-H3500WR120/gi, 'MSG-H3-AGWR120-042A0-BR')
      .replace(/12VDC/gi, '12V')
      .replace(/12\.0V/gi, '12V')
      .replace(/3,5A/gi, '3.5A');

    const cleanAlpha = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQ = cleanAlpha(normalizedText);

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

    // Extract key parameters via regex from normalized OCR text
    const detectedPnMatch = normalizedText.match(/\b(191\d{6}(?:-[A-Z0-9]+)?)\b/i) || normalizedText.match(/(?:P\/N|PN|PART\s*NUMBER)[:\s]*([A-Z0-9-]+)/i);
    const detectedModelMatch = normalizedText.match(/\b(MSG-[A-Z0-9-]+|ADS-[A-Z0-9-]+|NBS[A-Z0-9-]+|F42L1-[A-Z0-9-]+|MU[0-9]+-[A-Z0-9-]+)\b/i) || normalizedText.match(/(?:MODELO|MOD)[:\s]*([A-Z0-9-]+)/i);
    const detectedMfgMatch = normalizedText.match(/\b(SAGEMCOM|MOSO|NETBIT|FRECOM|FLEX|SHENZHEN\s*HONOR|TELLESCOM|LITE\s*ON|AC\s*BEL|I\.T\.E|LEADER|DELTA)\b/i);
    const detectedSapMatch = normalizedText.match(/\b(220\d{5})\b/);

    // Extract DC Output specs: check for 3.5A, 2.5A, 1.5A, 2A, 4A, 1A
    let detectedCurrent = 'N/A';
    if (/\b3[\.,]5\s*A\b/i.test(normalizedText)) detectedCurrent = '3,5A';
    else if (/\b2[\.,]5\s*A\b/i.test(normalizedText)) detectedCurrent = '2,5A';
    else if (/\b1[\.,]5\s*A\b/i.test(normalizedText)) detectedCurrent = '1,5A';
    else if (/\b4[\.,]0?\s*A\b/i.test(normalizedText)) detectedCurrent = '4A';
    else if (/\b2[\.,]0?\s*A\b/i.test(normalizedText)) detectedCurrent = '2A';
    else if (/\b1[\.,]0?\s*A\b/i.test(normalizedText) && !/\b1[\.,][25]\s*A\b/i.test(normalizedText)) detectedCurrent = '1A';

    let detectedVoltage = '12V';
    if (/\b20\s*V\b/i.test(normalizedText)) detectedVoltage = '20V';
    else if (/\b5\s*V\b/i.test(normalizedText)) detectedVoltage = '5V';
    else if (/\b9\s*V\b/i.test(normalizedText)) detectedVoltage = '9V';

    let bestMatch: { terminal: Terminal; ps: any; score: number } | null = null;
    let maxScore = 0;

    for (const t of TERMINALS_DATA) {
      for (const ps of t.powerSupplies) {
        let score = 0;

        // 1. SAP Match (Highest Weight)
        if (detectedSapMatch && ps.sapCode === detectedSapMatch[1]) {
          score += 350;
        } else if (ps.sapCode && ps.sapCode.length >= 6 && cleanQ.includes(ps.sapCode)) {
          score += 300;
        }

        // 2. Part Number Match
        if (ps.partNumber && ps.partNumber !== 'N/A') {
          const psPnClean = cleanAlpha(ps.partNumber);
          const corePn = ps.partNumber.match(/\d{7,10}/);
          if (detectedPnMatch && cleanAlpha(detectedPnMatch[1]).includes(corePn ? corePn[0] : '')) {
            score += 300;
          } else if (psPnClean.length >= 5 && cleanQ.includes(psPnClean)) {
            score += 250;
          } else if (corePn && cleanQ.includes(corePn[0])) {
            score += 200;
          }
        }

        // 3. Model Match
        if (ps.model) {
          const modelClean = cleanAlpha(ps.model);
          if (detectedModelMatch && cleanAlpha(detectedModelMatch[1]).includes(modelClean.slice(0, 8))) {
            score += 250;
          } else if (modelClean.length >= 5 && cleanQ.includes(modelClean)) {
            score += 200;
          } else {
            const parts = ps.model.split(/[\s-]/);
            for (const p of parts) {
              const pClean = cleanAlpha(p);
              if (pClean.length >= 5 && cleanQ.includes(pClean)) {
                score += 100;
                break;
              }
            }
          }
        }

        // 4. Electrical Spec Match
        const tV = t.voltage.replace(/[^\d]/g, '');
        const dV = detectedVoltage.replace(/[^\d]/g, '');
        const tC = t.current.replace(',', '.').replace(/[^\d.]/g, '');
        const dC = detectedCurrent.replace(',', '.').replace(/[^\d.]/g, '');

        if (tV === dV) {
          if (detectedCurrent !== 'N/A' && tC === dC) {
            score += 150;
          } else if (detectedCurrent !== 'N/A' && tC !== dC) {
            score -= 300; // Strict penalty for wrong current!
          }
        } else {
          score -= 500; // Penalty for wrong voltage!
        }

        // 5. Manufacturer Match
        if (ps.manufacturer) {
          const mfgParts = ps.manufacturer.split(/[\s/]/);
          for (const m of mfgParts) {
            const mClean = cleanAlpha(m);
            if (mClean.length >= 4 && cleanQ.includes(mClean)) {
              score += 50;
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

    if (bestMatch && maxScore >= 60) {
      const { terminal, ps } = bestMatch;
      return {
        modeloFonte: ps.model || 'Fonte Homologada Claro',
        sapCode: ps.sapCode || 'N/A',
        tensao: terminal.voltage,
        corrente: terminal.current,
        fabricante: ps.manufacturer || (detectedMfgMatch ? detectedMfgMatch[1].toUpperCase() : 'Fabricante Homologado'),
        partNumber: ps.partNumber !== 'N/A' ? ps.partNumber : (detectedPnMatch ? detectedPnMatch[1] : 'N/A'),
        modeloTerminalSugerido: terminal.name,
        resumoExplicativo: `Reconhecido da imagem: Fonte ${ps.model} (P/N: ${ps.partNumber}, SAP: ${ps.sapCode}) homologada para os equipamentos ${terminal.name} (${terminal.voltage} ${terminal.current}).`
      };
    } else {
      // Find terminal matching detected voltage and current
      const matchingTerminal = TERMINALS_DATA.find(t => 
        t.voltage.replace(/[^\d]/g, '') === detectedVoltage.replace(/[^\d]/g, '') &&
        (detectedCurrent === 'N/A' || t.current.replace(',', '.').replace(/[^\d.]/g, '') === detectedCurrent.replace(',', '.').replace(/[^\d.]/g, ''))
      );

      return {
        modeloFonte: detectedModelMatch ? detectedModelMatch[1] : 'Modelo não cadastrado no Book',
        sapCode: detectedSapMatch ? detectedSapMatch[1] : 'Verificar etiqueta',
        tensao: detectedVoltage,
        corrente: detectedCurrent,
        fabricante: detectedMfgMatch ? detectedMfgMatch[1].toUpperCase() : 'Não identificado',
        partNumber: detectedPnMatch ? detectedPnMatch[1] : 'N/A',
        modeloTerminalSugerido: matchingTerminal ? matchingTerminal.name : 'Não encontrado no Book',
        resumoExplicativo: `Leitura local via OCR concluída. Tensão: ${detectedVoltage}, Corrente: ${detectedCurrent}, P/N: ${detectedPnMatch ? detectedPnMatch[1] : '?'}. Equipamento sugerido: ${matchingTerminal ? matchingTerminal.name : 'Verifique no Book'}.`
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
            dataResult = enrichWithBookData(data.result);
          }
        }
      } catch (serverErr) {
        console.warn('Backend server /api/analyze-font indisponível:', serverErr);
      }

      // 2. Se o backend não respondeu (ex: hospedagem estática com 404), tenta o Gemini diretamente via cliente
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
