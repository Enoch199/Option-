import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ASSETS, TIMEFRAMES, CATEGORIES } from './constants';
import { Asset, Timeframe, AnalysisResult, MarketDataPoint, SignalType, AssetCategory } from './types';
import LiveChart from './components/LiveChart';
import AnalysisPanel from './components/AnalysisPanel';
import PredictionTool from './components/PredictionTool';
import TechnicalIndicators from './components/TechnicalIndicators';
import { analyzeMarketData } from './services/geminiService';
import { TrendingUp, LayoutGrid, Settings, Info } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>(AssetCategory.FOREX_OTC);
  
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Simulation Refs
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const priceRef = useRef<number>(1.0850); // Starting mock price
  const rsiRef = useRef<number>(50);
  const macdRef = useRef<{ macd: number; signal: number }>({ macd: 0, signal: 0 });

  // Helper to generate next simulated data point including indicators
  const generateNextDataPoint = (currentTime: number, currentPrice: number, category: AssetCategory) => {
     const volatility = category === AssetCategory.CRYPTO ? 0.002 : 0.0001;
     const change = currentPrice * volatility * (Math.random() - 0.5);
     const newPrice = currentPrice + change;
     
     // Simulate RSI (Simple random walk bounded 0-100 with slight mean reversion)
     let rsiChange = (Math.random() - 0.5) * 8;
     if (rsiRef.current > 70) rsiChange -= 1; // Pull down
     if (rsiRef.current < 30) rsiChange += 1; // Pull up
     
     let newRsi = rsiRef.current + rsiChange;
     newRsi = Math.max(10, Math.min(90, newRsi));
     rsiRef.current = newRsi;

     // Simulate MACD
     const macdMove = (Math.random() - 0.5) * (category === AssetCategory.CRYPTO ? 0.5 : 0.0002);
     const newMacdLine = macdRef.current.macd + macdMove;
     const newSignal = macdRef.current.signal + (newMacdLine - macdRef.current.signal) * 0.15; // Simple lag
     macdRef.current = { macd: newMacdLine, signal: newSignal };
     
     return {
        time: currentTime,
        price: newPrice,
        rsi: newRsi,
        macd: {
          macd: newMacdLine,
          signal: newSignal,
          histogram: newMacdLine - newSignal
        }
     };
  };

  // Reset simulation when asset changes
  useEffect(() => {
    setMarketData([]);
    setAnalysis(null);
    
    // Reset refs
    priceRef.current = selectedAsset.category === AssetCategory.CRYPTO ? 45000 : 
                       selectedAsset.category === AssetCategory.COMMODITIES ? 2000 : 1.0850;
    rsiRef.current = 50;
    macdRef.current = { macd: 0, signal: 0 };
    
    // Initial fill
    const initialData: MarketDataPoint[] = [];
    const now = Date.now();
    
    // Generate 60 points of history
    for(let i = 60; i > 0; i--) {
      const point = generateNextDataPoint(now - i * 1000, priceRef.current, selectedAsset.category);
      priceRef.current = point.price;
      initialData.push(point);
    }
    setMarketData(initialData);

  }, [selectedAsset]);

  // Live Data Feed Simulation
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setMarketData(prev => {
        const newPoint = generateNextDataPoint(Date.now(), priceRef.current, selectedAsset.category);
        priceRef.current = newPoint.price;
        
        // Keep last 60 points
        const newData = [...prev, newPoint];
        if (newData.length > 60) newData.shift();
        return newData;
      });
    }, 1000); // 1 tick per second

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedAsset]);

  const handleAnalyze = async () => {
    if (marketData.length < 10) return;
    
    setIsAnalyzing(true);
    
    // Add a small artificial delay
    const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
    
    const resultPromise = analyzeMarketData(selectedAsset, selectedTimeframe, marketData);
    
    const [result] = await Promise.all([resultPromise, minDelay]);
    
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  // Filter assets by category
  const filteredAssets = ASSETS.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-sky-100 text-slate-800 flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR / ASSET SELECTOR */}
      <aside className="w-full md:w-64 bg-sky-900 border-r border-sky-800 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-sky-800 flex items-center gap-2 bg-sky-950/30">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <TrendingUp className="text-sky-600 w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-white">Pocket<span className="text-sky-300">Bot</span> AI</h1>
        </div>

        <div className="p-4">
          <label className="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2 block">Catégorie</label>
          <div className="grid grid-cols-2 gap-2 mb-6">
             {CATEGORIES.map(cat => (
               <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs p-2 rounded border transition-all truncate
                  ${selectedCategory === cat 
                    ? 'bg-sky-700 border-sky-500 text-white shadow-md' 
                    : 'bg-sky-800 border-sky-700 text-sky-200 hover:bg-sky-750'}`}
               >
                 {cat.replace('Forex ', '').replace('Matières Premières', 'Matières')}
               </button>
             ))}
          </div>

          <label className="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2 block">Paires Disponibles</label>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)] pr-2 scrollbar-thin scrollbar-thumb-sky-700">
            {filteredAssets.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all
                  ${selectedAsset.symbol === asset.symbol 
                    ? 'bg-sky-700 border border-sky-600 shadow-inner text-white' 
                    : 'hover:bg-sky-800 border border-transparent text-sky-100'}`}
              >
                <span className="font-medium">
                  {asset.symbol}
                </span>
                {asset.isOtc && (
                  <span className="text-[10px] bg-sky-950/50 text-sky-200 px-1.5 py-0.5 rounded font-bold border border-sky-800">OTC</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-sky-100 relative">
        
        {/* Header Bar */}
        <header className="h-16 border-b border-sky-200 flex items-center justify-between px-6 bg-sky-50/80 backdrop-blur sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-sky-900">{selectedAsset.symbol}</h2>
             <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-600 text-sm border border-emerald-200 font-semibold">
                En direct
             </span>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-sky-200">
             {TIMEFRAMES.map((tf) => (
               <button
                 key={tf}
                 onClick={() => setSelectedTimeframe(tf)}
                 className={`px-3 py-1 rounded text-sm font-medium transition-all
                   ${selectedTimeframe === tf 
                     ? 'bg-sky-600 text-white shadow' 
                     : 'text-slate-500 hover:text-sky-700 hover:bg-sky-50'}`}
               >
                 {tf}
               </button>
             ))}
          </div>
        </header>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Chart & Tools */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart Card */}
            <div className="bg-white rounded-xl border border-sky-200 p-1 shadow-lg relative overflow-hidden group">
              <div className="absolute top-4 left-4 z-10 flex flex-col">
                <span className="text-xs text-slate-500 font-semibold">Prix Actuel</span>
                <span className="text-2xl font-mono font-bold text-slate-800 tracking-tighter">
                  {marketData.length > 0 ? marketData[marketData.length - 1].price.toFixed(5) : '---'}
                </span>
              </div>
              <LiveChart 
                data={marketData} 
                color={analysis?.signal === SignalType.SELL ? '#f43f5e' : '#0ea5e9'} 
              />
            </div>

            {/* Technical Indicators */}
            <TechnicalIndicators data={marketData} />

            {/* Secondary Feature: Prediction Tool */}
            <PredictionTool assets={ASSETS} />

            {/* Disclaimer */}
            <div className="bg-white/60 border border-sky-200 p-4 rounded-lg flex gap-3 items-start">
               <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
               <p className="text-xs text-sky-800 leading-relaxed">
                 <strong>Avertissement:</strong> Cet outil utilise l'intelligence artificielle (Gemini) pour simuler des analyses techniques. 
                 Le trading d'options comporte des risques élevés de perte de capital. 
                 Les signaux fournis sont à titre éducatif et démonstratif uniquement. Ne tradez pas avec de l'argent réel basé uniquement sur ce bot.
               </p>
            </div>

          </div>

          {/* Right Column: Analysis Panel */}
          <div className="lg:col-span-1 h-full min-h-[500px]">
            <AnalysisPanel 
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
            
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-lg border border-sky-200 shadow-md text-center">
                  <span className="block text-xs text-slate-500 uppercase font-semibold">Volatilité</span>
                  <span className="text-lg font-bold text-slate-800">Moyenne</span>
               </div>
               <div className="bg-white p-4 rounded-lg border border-sky-200 shadow-md text-center">
                  <span className="block text-xs text-slate-500 uppercase font-semibold">Fiabilité IA</span>
                  <span className="text-lg font-bold text-sky-600">87%</span>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;