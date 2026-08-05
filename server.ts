import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
