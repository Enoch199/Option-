import { Asset, AssetCategory } from './types';

export const TIMEFRAMES = ['3s', '15s', '30s', '1M', '3M', '5M', '30M', '1H', '2H'] as const;

const createAsset = (symbol: string, category: AssetCategory, isOtc: boolean): Asset => ({
  symbol,
  name: symbol,
  category,
  isOtc
});

export const ASSETS: Asset[] = [
  // Forex OTC
  createAsset('AUD/CHF OTC', AssetCategory.FOREX_OTC, true),
  createAsset('AUD/NZD OTC', AssetCategory.FOREX_OTC, true),
  createAsset('CAD/CHF OTC', AssetCategory.FOREX_OTC, true),
  createAsset('EUR/GBP OTC', AssetCategory.FOREX_OTC, true),
  createAsset('EUR/NZD OTC', AssetCategory.FOREX_OTC, true),
  createAsset('EUR/USD OTC', AssetCategory.FOREX_OTC, true),
  createAsset('GBP/USD OTC', AssetCategory.FOREX_OTC, true),
  createAsset('USD/EGP OTC', AssetCategory.FOREX_OTC, true),
  createAsset('USD/JPY OTC', AssetCategory.FOREX_OTC, true),
  createAsset('CHF/JPY OTC', AssetCategory.FOREX_OTC, true),
  createAsset('USD/CAD OTC', AssetCategory.FOREX_OTC, true),
  createAsset('CAD/JPY OTC', AssetCategory.FOREX_OTC, true),
  
  // Forex Classic
  createAsset('AUD/CHF', AssetCategory.FOREX_CLASSIC, false),
  createAsset('GBP/CHF', AssetCategory.FOREX_CLASSIC, false),
  createAsset('AUD/CAD', AssetCategory.FOREX_CLASSIC, false),
  createAsset('GBP/AUD', AssetCategory.FOREX_CLASSIC, false),
  createAsset('EUR/USD', AssetCategory.FOREX_CLASSIC, false),
  createAsset('GBP/CAD', AssetCategory.FOREX_CLASSIC, false),
  createAsset('USD/CHF', AssetCategory.FOREX_CLASSIC, false),
  createAsset('EUR/CAD', AssetCategory.FOREX_CLASSIC, false),
  createAsset('USD/JPY', AssetCategory.FOREX_CLASSIC, false),
  createAsset('GBP/JPY', AssetCategory.FOREX_CLASSIC, false),
  createAsset('CHF/JPY', AssetCategory.FOREX_CLASSIC, false),
  createAsset('EUR/CHF', AssetCategory.FOREX_CLASSIC, false),

  // Crypto
  createAsset('BNB OTC', AssetCategory.CRYPTO, true),
  createAsset('DOGECOIN OTC', AssetCategory.CRYPTO, true),
  createAsset('BITCOIN OTC', AssetCategory.CRYPTO, true),

  // Commodities
  createAsset('Gold OTC', AssetCategory.COMMODITIES, true),
  createAsset('Silver OTC', AssetCategory.COMMODITIES, true),
];

export const CATEGORIES = [
  AssetCategory.FOREX_OTC,
  AssetCategory.FOREX_CLASSIC,
  AssetCategory.CRYPTO,
  AssetCategory.COMMODITIES
];