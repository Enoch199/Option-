import React, { useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketDataPoint } from '../types';

interface LiveChartProps {
  data: MarketDataPoint[];
  color: string;
}

const LiveChart: React.FC<LiveChartProps> = ({ data, color }) => {
  // Format time for X Axis
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const domainMin = Math.min(...data.map(d => d.price));
  const domainMax = Math.max(...data.map(d => d.price));
  const padding = (domainMax - domainMin) * 0.1;

  return (
    <div className="h-64 w-full bg-white rounded-lg p-4 border border-sky-50/50">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="time" 
            tickFormatter={formatTime} 
            stroke="#94a3b8" 
            tick={{fontSize: 10}}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[domainMin - padding, domainMax + padding]} 
            stroke="#94a3b8" 
            tick={{fontSize: 10}}
            width={60}
            tickFormatter={(val) => val.toFixed(5)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelFormatter={formatTime}
            formatter={(value: number) => [value.toFixed(5), 'Prix']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;