import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CardWithHeader } from '../ui/Card';

export default function PointsChart({ data }) {
  return (
    <CardWithHeader title="Top 5 Drivers Overview" subtitle="Current Points" className="h-full min-h-[300px] flex flex-col">
      <div className="flex-1 p-6 pb-2 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232326" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#8e8e93" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#8e8e93" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `${val} pts`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1c20', borderColor: '#232326', borderRadius: '8px' }}
              itemStyle={{ color: '#e10600' }}
            />
            <Line 
              type="monotone" 
              dataKey="pts" 
              stroke="#e10600" 
              strokeWidth={3}
              dot={{ fill: '#e10600', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardWithHeader>
  );
}
