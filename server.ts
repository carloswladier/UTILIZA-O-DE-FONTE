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

      const prompt = `Você é um especialista técnico sênior de equipamentos e infraestrutura Claro NET (Book de Fontes & Terminais).
Sua tarefa é analisar ${imageBase64 ? 'a foto do rótulo/etiqueta da fonte de alimentação ou do terminal' : 'o texto informado pelo usuário: ' + textQuery} e extrair com máxima precisão os seguintes dados:
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
  "modeloFonte": string | null,
  "sapCode": string | null,
  "tensao": string | null,
  "corrente": string | null,
  "fabricante": string | null,
  "partNumber": string | null,
  "modeloTerminalSugerido": string | null,
  "resumoExplicativo": string
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
        model: "gemini-3.6-flash",
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
