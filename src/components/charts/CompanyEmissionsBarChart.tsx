'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Company } from '@/types';

interface CompanyEmissionsBarChartProps {
  companies: Company[];
  className?: string;
}

interface ChartData {
  name: string;
  gasoline: number;
  diesel: number;
  lpg: number;
  natural_gas: number;
  total: number;
}

// 배출원별 색상 (라인 차트와 동일)
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
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{`회사: ${label}`}</p>
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

export function CompanyEmissionsBarChart({ companies, className }: CompanyEmissionsBarChartProps) {
  // 회사별 배출원별 총 배출량 계산
  const chartData: ChartData[] = companies.map((company) => {
    const sourceData = {
      gasoline: 0,
      diesel: 0,
      lpg: 0,
      natural_gas: 0,
    };

    company.emissions.forEach((emission) => {
      if (emission.source in sourceData) {
        sourceData[emission.source as keyof typeof sourceData] += emission.emissions;
      }
    });

    const total = Object.values(sourceData).reduce((sum, val) => sum + val, 0);

    return {
      name: company.name,
      ...sourceData,
      total,
    };
  });

  // 총 배출량 기준으로 정렬
  chartData.sort((a, b) => b.total - a.total);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            className="text-muted-foreground text-sm"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            className="text-muted-foreground text-sm"
            tick={{ fontSize: 12 }}
            label={{ value: 'Emissions (tons CO2e)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar
            dataKey="gasoline"
            stackId="emissions"
            fill={sourceColors.gasoline}
            name="GASOLINE"
          />
          <Bar dataKey="diesel" stackId="emissions" fill={sourceColors.diesel} name="DIESEL" />
          <Bar dataKey="lpg" stackId="emissions" fill={sourceColors.lpg} name="LPG" />
          <Bar
            dataKey="natural_gas"
            stackId="emissions"
            fill={sourceColors.natural_gas}
            name="NATURAL GAS"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
