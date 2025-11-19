import React, { useState } from 'react';
import { Asset } from '../types';
import { Clock, Search } from 'lucide-react';
import { predictPriceAtTime } from '../services/geminiService';

interface PredictionToolProps {
  assets: Asset[];
}

const PredictionTool: React.FC<PredictionToolProps> = ({ assets }) => {
  const [selectedTime, setSelectedTime] = useState<string>('12:00:00');
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>(assets[0].symbol);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    const asset = assets.find(a => a.symbol === selectedAssetSymbol);
    if (asset) {
      // Simulate fetching a "current price" roughly
      const mockCurrentPrice = Math.random() * 100 + 1000; 
      const response = await predictPriceAtTime(asset, selectedTime, mockCurrentPrice);
      setResult(response);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-sky-100 mt-6 shadow-md">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-sky-600" />
        Comparateur Temporel & Prévision
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Time Input */}
        <div>
          <label className="block text-xs text-slate-500 mb-1 font-semibold">Temps Cible (HH:MM:SS)</label>
          <input
            type="time"
            step="1"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full bg-sky-50 border border-sky-200 rounded p-3 text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
          />
        </div>

        {/* Asset Select */}
        <div>
          <label className="block text-xs text-slate-500 mb-1 font-semibold">Paire / Actif</label>
          <select
            value={selectedAssetSymbol}
            onChange={(e) => setSelectedAssetSymbol(e.target.value)}
            className="w-full bg-sky-50 border border-sky-200 rounded p-3 text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
          >
            {assets.map(a => (
              <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
            ))}
          </select>
        </div>

        {/* Action */}
        <div className="flex items-end">
          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-bold p-3 rounded flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {loading ? (
              <span className="animate-pulse">Analyse...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Comparer
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-sky-50 rounded p-4 border-l-4 border-sky-500 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-slate-700 text-sm">{result}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionTool;