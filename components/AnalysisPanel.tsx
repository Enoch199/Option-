import React from 'react';
import { AnalysisResult, SignalType } from '../types';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Activity } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isAnalyzing, onAnalyze }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-xl flex flex-col items-center justify-between h-full relative overflow-hidden">
      
      {/* Header */}
      <div className="text-center w-full z-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Activity className="w-5 h-5 text-sky-600" />
          Analyse du Marché
        </h2>
        <p className="text-slate-500 text-sm">Algorithme Gemini AI 2.5</p>
      </div>

      {/* Result Display */}
      <div className="flex-1 flex flex-col items-center justify-center w-full my-4 z-10">
        {isAnalyzing ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-24 h-24 rounded-full border-4 border-t-sky-500 border-sky-100 animate-spin mb-4"></div>
            <span className="text-sky-600 font-semibold">Analyse des indicateurs...</span>
          </div>
        ) : analysis ? (
          <>
            <div className={`transform transition-all duration-500 hover:scale-105`}>
              {analysis.signal === SignalType.BUY && (
                <ArrowUpCircle className="w-32 h-32 text-emerald-500 drop-shadow-lg" />
              )}
              {analysis.signal === SignalType.SELL && (
                <ArrowDownCircle className="w-32 h-32 text-rose-500 drop-shadow-lg" />
              )}
              {analysis.signal === SignalType.NEUTRAL && (
                <MinusCircle className="w-32 h-32 text-gray-400" />
              )}
            </div>
            
            <div className="mt-6 text-center">
              <h3 className={`text-4xl font-black tracking-wider mb-2 
                ${analysis.signal === SignalType.BUY ? 'text-emerald-500' : 
                  analysis.signal === SignalType.SELL ? 'text-rose-500' : 'text-gray-500'}`}>
                {analysis.signal}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-slate-600 text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200 font-medium">
                  Force: {analysis.trendStrength}%
                </span>
                <span className="text-slate-600 text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200 font-medium">
                  {analysis.timeframe}
                </span>
              </div>
              <p className="text-slate-600 text-sm max-w-xs mx-auto italic border-l-2 border-sky-200 pl-3 text-left bg-sky-50/50 p-2 rounded-r">
                "{analysis.reasoning}"
              </p>
            </div>
          </>
        ) : (
          <div className="text-slate-400 text-center opacity-50">
            <Activity className="w-16 h-16 mx-auto mb-2 text-slate-300" />
            <p>En attente d'analyse</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className={`w-full py-4 rounded-lg font-bold text-lg tracking-wide shadow-lg transition-all z-10
          ${isAnalyzing 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white hover:shadow-sky-500/30'
          }`}
      >
        {isAnalyzing ? 'TRAITEMENT...' : 'LANCER L\'ANALYSE'}
      </button>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-white -z-0"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
    </div>
  );
};

export default AnalysisPanel;