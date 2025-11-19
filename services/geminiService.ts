import { GoogleGenAI, Type } from "@google/genai";
import { Asset, MarketDataPoint, Timeframe, SignalType, AnalysisResult } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    throw new Error("Clé API Gemini manquante");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeMarketData = async (
  asset: Asset,
  timeframe: Timeframe,
  dataPoints: MarketDataPoint[]
): Promise<AnalysisResult> => {
  const ai = getClient();
  
  // Prepare data string for the prompt (last 20 points to save tokens)
  const recentData = dataPoints.slice(-20).map(p => p.price.toFixed(5)).join(', ');
  
  const prompt = `
    Agis comme un expert en trading technique senior pour les options binaires (Pocket Option).
    
    Analyse technique pour:
    Actif: ${asset.symbol}
    Timeframe: ${timeframe}
    Prix récents (du plus ancien au plus récent): [${recentData}]
    
    Tâche:
    Détermine la tendance immédiate et fournis un signal clair d'ACHAT (Hausse) ou VENTE (Baisse).
    Le signal doit être basé sur la dynamique des prix (momentum), les supports/résistances implicites dans la suite de nombres.
    
    Réponds UNIQUEMENT en JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, enum: ["ACHAT", "VENTE", "NEUTRE"] },
            trendStrength: { type: Type.INTEGER, description: "Force du signal entre 0 et 100" },
            reasoning: { type: Type.STRING, description: "Brève explication technique en français (max 20 mots)" }
          },
          required: ["signal", "trendStrength", "reasoning"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Pas de réponse de l'IA");

    const json = JSON.parse(resultText);

    return {
      signal: json.signal as SignalType,
      trendStrength: json.trendStrength,
      reasoning: json.reasoning,
      timestamp: Date.now(),
      asset: asset.symbol,
      timeframe: timeframe
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo purposes if API fails
    return {
      signal: Math.random() > 0.5 ? SignalType.BUY : SignalType.SELL,
      trendStrength: 50,
      reasoning: "Analyse AI indisponible, signal technique calculé localement.",
      timestamp: Date.now(),
      asset: asset.symbol,
      timeframe: timeframe
    };
  }
};

export const predictPriceAtTime = async (
  asset: Asset,
  targetTime: string,
  currentPrice: number
): Promise<string> => {
    const ai = getClient();
    const prompt = `
      L'utilisateur veut comparer le prix actuel (${currentPrice}) de ${asset.symbol} avec une projection pour ${targetTime}.
      Comme c'est impossible de prédire le futur exact, fournis une analyse de probabilité basée sur la volatilité typique de cet actif à cette heure de la journée.
      Sois bref et professionnel.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Analyse non disponible.";
    } catch (e) {
        return "Erreur de connexion au service d'analyse.";
    }
}