export enum AssetCategory {
  FOREX_OTC = 'Forex OTC',
  FOREX_CLASSIC = 'Forex Classique',
  CRYPTO = 'Crypto-monnaies',
  COMMODITIES = 'Matières Premières'
}

export interface Asset {
  symbol: string;
  name: string;
  category: AssetCategory;
  isOtc: boolean;
}

export type Timeframe = '3s' | '15s' | '30s' | '1M' | '3M' | '5M' | '30M' | '1H' | '2H';

export interface MarketDataPoint {
  time: number; // Timestamp
  price: number;
  rsi?: number;
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
}

export enum SignalType {
  BUY = 'ACHAT', // Call / Haut
  SELL = 'VENTE', // Put / Bas
  NEUTRAL = 'NEUTRE'
}

export interface AnalysisResult {
  signal: SignalType;
  trendStrength: number; // 0-100
  reasoning: string;
  timestamp: number;
  asset: string;
  timeframe: Timeframe;
}

export interface ComparisonRequest {
  targetTime: string; // HH:mm:ss
  asset: Asset;
}