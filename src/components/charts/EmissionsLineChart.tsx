'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GhgEmission } from '@/types';

interface EmissionsLineChartProps {
  data: GhgEmission[];
  className?: string;
}

// 배출원별 색상 정의
const sourceColors = {
  gasoline: '#ef4444', // 빨간색 (가솔린)
  diesel: '#f97316', // 오렌지색 (디젤)
  lpg: '#eab308', // 노란색 (LPG)
  natural_gas: '#22c55e', // 녹색 (천연가스)
};

// 툴팁 컴포넌트 타입 정의
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

// 툴팁 커스터마이징
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{`기간: ${label}`}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value.toFixed(1)} tons CO2e`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EmissionsLineChart({ data, className }: EmissionsLineChartProps) {
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
        <LineChart
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
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
          {sources.map((source) => (
            <Line
              key={source}
              type="monotone"
              dataKey={source}
              stroke={sourceColors[source as keyof typeof sourceColors]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={source.replace('_', ' ').toUpperCase()}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
