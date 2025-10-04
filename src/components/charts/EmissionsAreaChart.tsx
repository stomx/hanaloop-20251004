'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GhgEmission } from '@/types';

interface EmissionsAreaChartProps {
  data: GhgEmission[];
  className?: string;
}

// 배출원별 색상 (다른 차트와 동일)
const sourceColors = {
  gasoline: '#ef4444',
  diesel: '#f97316',
  lpg: '#eab308',
  natural_gas: '#22c55e',
};

// 툴팁 타입 정의
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{`기간: ${label}`}</p>
        <p className="font-medium text-primary mb-1">{`총 배출량: ${total.toFixed(1)} tons CO2e`}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(1)} tons CO2e`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EmissionsAreaChart({ data, className }: EmissionsAreaChartProps) {
  // 데이터를 월별로 그룹화하고 배출원별로 정리
  type ChartDataPoint = {
    month: string;
    [key: string]: string | number;
  };

  const groupedData = data.reduce((acc, item) => {
    const existing = acc.find((d) => d.month === item.yearMonth);
    if (existing) {
      existing[item.source] = item.emissions;
    } else {
      acc.push({
        month: item.yearMonth,
        [item.source]: item.emissions,
      });
    }
    return acc;
  }, [] as ChartDataPoint[]);

  // 월별 정렬
  groupedData.sort((a, b) => a.month.localeCompare(b.month));

  // 사용된 배출원들 추출
  const sources = Array.from(new Set(data.map((d) => d.source)));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={groupedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="month"
            className="text-muted-foreground text-sm"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            className="text-muted-foreground text-sm"
            tick={{ fontSize: 12 }}
            label={{ value: 'Emissions (tons CO2e)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {sources.map((source) => (
            <Area
              key={source}
              type="monotone"
              dataKey={source}
              stackId="1"
              stroke={sourceColors[source as keyof typeof sourceColors]}
              fill={sourceColors[source as keyof typeof sourceColors]}
              fillOpacity={0.6}
              name={source.replace('_', ' ').toUpperCase()}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
