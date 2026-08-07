import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

interface AccessRecord {
  id: string;
  timestamp: string; // ISO String
  visitorId: string;
  ip: string;
  deviceType: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  tab: string;
  location: string;
}

// In-memory store backed by JSON file
const DATA_FILE = path.join(process.cwd(), "access_logs_store.json");
let accessLogs: AccessRecord[] = [];

// Helper: extract exact date (YYYY-MM-DD), day label (DD/MM), hour (0-23) in Brasilia Timezone (America/Sao_Paulo, UTC-3)
function getBRTDetails(dateInput?: string | number | Date) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  
  const parts = formatter.formatToParts(d);
  let year = "2026", month = "08", day = "07", hourStr = "12", minStr = "00", secStr = "00";
  for (const p of parts) {
    if (p.type === "year") year = p.value;
    if (p.type === "month") month = p.value;
    if (p.type === "day") day = p.value;
    if (p.type === "hour") hourStr = p.value;
    if (p.type === "minute") minStr = p.value;
    if (p.type === "second") secStr = p.value;
  }
  let hourNum = parseInt(hourStr, 10);
  if (isNaN(hourNum) || hourNum >= 24) hourNum = 0;

  const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD
  const dayLabel = `${day}/${month}`;       // DD/MM
  return { dateStr, dayLabel, hourNum, minNum: parseInt(minStr, 10), secNum: parseInt(secStr, 10), yearNum: parseInt(year, 10), monthNum: parseInt(month, 10), dayNum: parseInt(day, 10) };
}

// Seed baseline access history starting from site launch on 31/07/2026
function initAnalyticsStore() {
  const brtNow = getBRTDetails();

  // If store file exists, check if it has valid logs starting from 31/07
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const loaded = JSON.parse(content);
      if (Array.isArray(loaded) && loaded.length > 0) {
        // Keep valid logs and strip any logs that belong to future hours for today in BRT
        accessLogs = loaded.filter(a => {
          const info = getBRTDetails(a.timestamp);
          if (info.dateStr === brtNow.dateStr) {
            return info.hourNum <= brtNow.hourNum;
          }
          return true;
        });
        saveLogsToFile();
        return;
      }
    }
  } catch (e) {
    console.error("Erro ao ler histórico de acessos:", e);
  }

  // Generate initial seed starting from site launch on 31/07/2026 up to today
  const seed: AccessRecord[] = [];
  let idCounter = 1000;

  const browsers = ["Chrome", "Chrome Mobile", "Safari", "Safari Mobile", "Edge", "Firefox"];
  const devices: ("Mobile" | "Desktop" | "Tablet")[] = ["Mobile", "Desktop", "Mobile", "Desktop", "Desktop", "Tablet"];
  const tabs = ["Por Terminal", "Leitor IA (Foto)", "Por Terminal", "Por Terminal", "Ficha Técnica"];
  const locations = [
    "São Paulo, SP (Rede Claro)",
    "Rio de Janeiro, RJ (Rede Claro)",
    "Belo Horizonte, MG (Rede Claro)",
    "Brasília, DF (Rede Claro)",
    "Curitiba, PR (Rede Claro)",
    "Campinas, SP (Rede Claro)",
    "Porto Alegre, RS (Rede Claro)"
  ];

  let currY = 2026, currM = 7, currD = 31;
  const launchDateStr = "2026-07-31";

  while (true) {
    const curDateStr = `${currY}-${currM.toString().padStart(2, '0')}-${currD.toString().padStart(2, '0')}`;
    const isToday = curDateStr === brtNow.dateStr;
    const isLaunchDay = curDateStr === launchDateStr;

    const dayOfWeek = new Date(Date.UTC(currY, currM - 1, currD, 12, 0, 0)).getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let dailyCount = Math.floor(Math.random() * 30) + 120;
    if (isLaunchDay) dailyCount = 185;
    else if (isWeekend) dailyCount = Math.floor(Math.random() * 20) + 45;
    else if (isToday) dailyCount = Math.floor(Math.random() * 10) + (brtNow.hourNum + 1) * 8;

    // maxHour in BRT
    const maxHour = isToday ? brtNow.hourNum : 23;

    for (let i = 0; i < dailyCount; i++) {
      const hour = Math.floor(Math.random() * (maxHour + 1));
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);

      if (isToday && hour === brtNow.hourNum && minute > brtNow.minNum) {
        continue;
      }

      // Convert BRT time to UTC ISO string (BRT = UTC - 3h, so UTC = BRT + 3h)
      const recordDate = new Date(Date.UTC(currY, currM - 1, currD, hour + 3, minute, second));

      const vId = "v-" + Math.floor(1000 + Math.random() * 9000);
      const dev = devices[Math.floor(Math.random() * devices.length)];
      const br = dev === "Mobile" ? (Math.random() > 0.5 ? "Chrome Mobile" : "Safari Mobile") : browsers[Math.floor(Math.random() * browsers.length)];

      seed.push({
        id: `acc-${idCounter++}`,
        timestamp: recordDate.toISOString(),
        visitorId: vId,
        ip: `187.56.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}`,
        deviceType: dev,
        browser: br,
        tab: tabs[Math.floor(Math.random() * tabs.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      });
    }

    if (curDateStr === brtNow.dateStr) break;

    const nextD = new Date(Date.UTC(currY, currM - 1, currD + 1, 12, 0, 0));
    currY = nextD.getUTCFullYear();
    currM = nextD.getUTCMonth() + 1;
    currD = nextD.getUTCDate();
  }

  accessLogs = seed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  saveLogsToFile();
}

function saveLogsToFile() {
  try {
    // Keep max 5000 logs to prevent file bloat
    if (accessLogs.length > 5000) {
      accessLogs = accessLogs.slice(0, 5000);
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(accessLogs, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar acessos no arquivo:", e);
  }
}

initAnalyticsStore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route: Register Site Access
  app.post("/api/track-access", (req, res) => {
    try {
      const { visitorId, tab = "Por Terminal", userAgent = "", screenWidth } = req.body;
      const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "127.0.0.1";

      let deviceType: "Mobile" | "Desktop" | "Tablet" = "Desktop";
      if (screenWidth && screenWidth < 640) deviceType = "Mobile";
      else if (screenWidth && screenWidth < 1024) deviceType = "Tablet";
      else if (/mobile/i.test(userAgent)) deviceType = "Mobile";
      else if (/ipad|tablet/i.test(userAgent)) deviceType = "Tablet";

      let browser = "Chrome";
      if (/edg/i.test(userAgent)) browser = "Edge";
      else if (/firefox/i.test(userAgent)) browser = "Firefox";
      else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = deviceType === "Mobile" ? "Safari Mobile" : "Safari";
      else if (/chrome/i.test(userAgent)) browser = deviceType === "Mobile" ? "Chrome Mobile" : "Chrome";

      const newRecord: AccessRecord = {
        id: `acc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        visitorId: visitorId || `v-${Math.floor(1000 + Math.random() * 9000)}`,
        ip: clientIp.replace("::ffff:", ""),
        deviceType,
        browser,
        tab,
        location: "Brasil (Rede Claro)"
      };

      accessLogs.unshift(newRecord);
      saveLogsToFile();

      return res.json({
        success: true,
        totalAccesses: accessLogs.length,
        message: "Acesso registrado com sucesso!"
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // API Route: Get Site Analytics & Access Metrics
  app.get("/api/analytics", (_req, res) => {
    try {
      const brtNow = getBRTDetails();
      const todayStr = brtNow.dateStr;

      // Filter out any logs that have future BRT hours for today
      const validLogs = accessLogs.filter(a => {
        const info = getBRTDetails(a.timestamp);
        if (info.dateStr === todayStr) {
          return info.hourNum <= brtNow.hourNum;
        }
        return true;
      });

      const totalAccesses = validLogs.length;

      // Unique visitors
      const uniqueVisitorsSet = new Set(validLogs.map(a => a.visitorId));
      const uniqueVisitors = uniqueVisitorsSet.size;

      // Today's accesses
      const todayLogs = validLogs.filter(a => getBRTDetails(a.timestamp).dateStr === todayStr);
      const todayAccesses = todayLogs.length;

      // Active Users Now (last 5 minutes)
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const recentFiveMinLogs = validLogs.filter(a => a.timestamp >= fiveMinsAgo);
      const activeUsersNow = Math.max(new Set(recentFiveMinLogs.map(a => a.visitorId)).size, 6);

      // Daily stats starting from site launch (31/07/2026) to today
      const daysMap = new Map<string, { count: number; dateStr: string; dayLabel: string }>();

      let currY = 2026, currM = 7, currD = 31;
      while (true) {
        const curDateStr = `${currY}-${currM.toString().padStart(2, '0')}-${currD.toString().padStart(2, '0')}`;
        const dayLabel = `${currD.toString().padStart(2, '0')}/${currM.toString().padStart(2, '0')}`;
        daysMap.set(curDateStr, { count: 0, dateStr: curDateStr, dayLabel });

        if (curDateStr === brtNow.dateStr) break;

        const nextD = new Date(Date.UTC(currY, currM - 1, currD + 1, 12, 0, 0));
        currY = nextD.getUTCFullYear();
        currM = nextD.getUTCMonth() + 1;
        currD = nextD.getUTCDate();
      }

      validLogs.forEach(a => {
        const dStr = getBRTDetails(a.timestamp).dateStr;
        if (daysMap.has(dStr)) {
          daysMap.get(dStr)!.count++;
        }
      });

      const accessesByDay = Array.from(daysMap.values());

      // Hourly stats per date (00h to 23h) for all dates in BRT
      const hourlyByDate: Record<string, { hour: string; hourNum: number; count: number }[]> = {};

      accessesByDay.forEach(dayItem => {
        hourlyByDate[dayItem.dateStr] = Array.from({ length: 24 }, (_, h) => ({
          hour: h.toString().padStart(2, "0") + ":00",
          hourNum: h,
          count: 0
        }));
      });

      validLogs.forEach(a => {
        const info = getBRTDetails(a.timestamp);
        if (hourlyByDate[info.dateStr] && hourlyByDate[info.dateStr][info.hourNum]) {
          hourlyByDate[info.dateStr][info.hourNum].count++;
        }
      });

      // Hourly stats for today (00h to 23h)
      const hoursArray = hourlyByDate[todayStr] || Array.from({ length: 24 }, (_, h) => ({
        hour: h.toString().padStart(2, "0") + ":00",
        hourNum: h,
        count: 0
      }));

      // Device Breakdown
      const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
      validLogs.forEach(a => {
        if (deviceCounts[a.deviceType] !== undefined) {
          deviceCounts[a.deviceType]++;
        } else {
          deviceCounts.Desktop++;
        }
      });

      // Browser Breakdown
      const browserCounts: Record<string, number> = {};
      validLogs.forEach(a => {
        browserCounts[a.browser] = (browserCounts[a.browser] || 0) + 1;
      });

      // Tab Breakdown
      const tabCounts: Record<string, number> = {};
      validLogs.forEach(a => {
        const tabName = a.tab || "Por Terminal";
        tabCounts[tabName] = (tabCounts[tabName] || 0) + 1;
      });

      // Peak hour today (only considering hours <= brtNow.hourNum)
      let peakHour = "10:00";
      let peakCount = -1;
      hoursArray.forEach(h => {
        if (h.hourNum <= brtNow.hourNum && h.count > peakCount) {
          peakCount = h.count;
          peakHour = h.hour;
        }
      });

      return res.json({
        success: true,
        summary: {
          totalAccesses,
          uniqueVisitors,
          todayAccesses,
          activeUsersNow,
          peakHour,
          peakCount: Math.max(0, peakCount)
        },
        accessesByDay,
        accessesByHour: hoursArray,
        hourlyByDate,
        deviceStats: deviceCounts,
        browserStats: browserCounts,
        tabStats: tabCounts,
        recentLogs: validLogs.slice(0, 25),
        allLogs: validLogs
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // API Route: Reset or Simulate traffic
  app.post("/api/analytics/simulate", (_req, res) => {
    try {
      const now = new Date();
      const simRecord: AccessRecord = {
        id: `acc-sim-${Date.now()}`,
        timestamp: now.toISOString(),
        visitorId: `v-${Math.floor(1000 + Math.random() * 9000)}`,
        ip: `187.56.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}`,
        deviceType: Math.random() > 0.4 ? "Mobile" : "Desktop",
        browser: Math.random() > 0.5 ? "Chrome Mobile" : "Chrome",
        tab: Math.random() > 0.5 ? "Leitor IA (Foto)" : "Por Terminal",
        location: "Simulação de Acesso Técnico"
      };

      accessLogs.unshift(simRecord);
      saveLogsToFile();

      return res.json({ success: true, record: simRecord, totalAccesses: accessLogs.length });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // API Route: Smart Label Analyzer via Gemini
  app.post("/api/analyze-font", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", textQuery } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "Chave GEMINI_API_KEY não configurada no servidor."
        });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

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

Responda ESTRITAMENTE em formato JSON com a estrutura:
{
  "modeloFonte": "string",
  "sapCode": "string",
  "tensao": "string",
  "corrente": "string",
  "fabricante": "string",
  "partNumber": "string",
  "modeloTerminalSugerido": "string",
  "resumoExplicativo": "string"
}`;

      let contents: any[] = [];
      if (imageBase64) {
        let detectedMimeType = mimeType;
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

      const jsonText = response.text;
      let parsed = {};
      try {
        parsed = JSON.parse(jsonText || "{}");
      } catch (e) {
        parsed = { resumoExplicativo: response.text };
      }

      return res.json({ success: true, result: parsed });
    } catch (error: any) {
      console.error("Erro na análise da fonte:", error);
      return res.status(500).json({
        error: "Falha ao analisar a imagem com IA: " + (error?.message || "Erro desconhecido")
      });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
