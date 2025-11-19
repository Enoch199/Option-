import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  ComposedChart, Bar, Cell
} from 'recharts';
import { MarketDataPoint } from '../types';
import { Activity, BarChart2 } from 'lucide-react';

interface TechnicalIndicatorsProps {
  data: MarketDataPoint[];
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ data }) => {
  // Format time for X Axis
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      
      {/* RSI Chart */}
      <div className="bg-white rounded-lg p-4 border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            RSI (14)
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {data.length > 0 && data[data.length - 1].rsi ? data[data.length - 1].rsi?.toFixed(2) : '--'}
          </span>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis 
                domain={[0, 100]} 
                hide 
                orientation="right"
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Tooltip 
                contentStyle={{ fontSize: '12px' }}
                labelFormatter={formatTime}
                formatter={(value: number) => [value.toFixed(2), 'RSI']}
              />
              <Line 
                type="monotone" 
                dataKey="rsi" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MACD Chart */}
      <div className="bg-white rounded-lg p-4 border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            MACD (12, 26, 9)
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {data.length > 0 && data[data.length - 1].macd ? data[data.length - 1].macd?.histogram.toFixed(5) : '--'}
          </span>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <ReferenceLine y={0} stroke="#94a3b8" strokeOpacity={0.5} />
              <Tooltip 
                contentStyle={{ fontSize: '12px' }}
                labelFormatter={formatTime}
                formatter={(value: number, name: string) => [value.toFixed(5), name === 'macd.histogram' ? 'Hist' : name === 'macd.macd' ? 'MACD' : 'Signal']}
              />
              <Bar dataKey="macd.histogram" fill="#94a3b8" opacity={0.5} isAnimationActive={false}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.macd && entry.macd.histogram >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="macd.macd" 
                stroke="#3b82f6" 
                strokeWidth={1.5} 
                dot={false} 
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="macd.signal" 
                stroke="#f97316" 
                strokeWidth={1.5} 
                dot={false} 
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default TechnicalIndicators;