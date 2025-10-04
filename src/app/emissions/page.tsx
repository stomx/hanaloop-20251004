'use client';

import { useEffect, useState } from 'react';
import {
  CompanyEmissionsBarChart,
  EmissionsAreaChart,
  EmissionsLineChart,
} from '@/components/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCompanies, fetchGhgEmissions } from '@/lib/api';
import type { Company, GhgEmission } from '@/types';

export default function EmissionsPage() {
  const [emissions, setEmissions] = useState<GhgEmission[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [emissionsData, companiesData] = await Promise.all([
          fetchGhgEmissions(),
          fetchCompanies(),
        ]);
        setEmissions(emissionsData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 전체 배출량 통계 계산
  const totalEmissions = emissions.reduce((sum, emission) => sum + emission.emissions, 0);
  const sourceStats = emissions.reduce(
    (acc, emission) => {
      acc[emission.source] = (acc[emission.source] || 0) + emission.emissions;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">배출 현황</h1>
        <p className="text-muted-foreground">온실가스 배출량 현황 및 추이를 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 배출량</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🌍</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmissions.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">tons CO2e</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주요 배출원</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">⛽</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(sourceStats)
                .reduce((a, b) => (sourceStats[a] > sourceStats[b] ? a : b))
                .toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.max(...Object.values(sourceStats)).toFixed(1)} tons CO2e
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 회사</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🏢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">개 회사</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">배출원 종류</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🔢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(sourceStats).length}</div>
            <p className="text-xs text-muted-foreground">종류</p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 배출량 추이 라인 차트 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>배출량 추이</CardTitle>
            <CardDescription>월별 배출원별 배출량 변화 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsLineChart data={emissions} />
          </CardContent>
        </Card>

        {/* 배출량 구성 면적 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>배출원별 구성</CardTitle>
            <CardDescription>시간에 따른 배출원별 기여도</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsAreaChart data={emissions} />
          </CardContent>
        </Card>

        {/* 회사별 배출량 비교 바 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>회사별 배출량</CardTitle>
            <CardDescription>회사별 배출원별 배출량 비교</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyEmissionsBarChart companies={companies} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
