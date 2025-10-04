import Link from 'next/link';
import {
  CompanyEmissionsBarChart,
  EmissionsAreaChart,
  EmissionsLineChart,
} from '@/components/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCompanies, fetchGhgEmissions, fetchPosts } from '@/lib/api';

export default async function Home() {
  const companies = await fetchCompanies();
  const posts = await fetchPosts();
  const emissions = await fetchGhgEmissions();
  const totalEmissions = emissions.reduce((sum, emission) => sum + emission.emissions, 0);
  const sourceStats = emissions.reduce(
    (acc, emission) => {
      acc[emission.source] = (acc[emission.source] || 0) + emission.emissions;
      return acc;
    },
    {} as Record<string, number>
  );
  const _recentPosts = posts.slice(0, 4); // 최신 4개 포스트

  return (
    <div className="space-y-6">
      {/* 통계 카드 + 차트 영역 */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" aria-label="통계 카드">
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
      </section>

      {/* 차트 영역 */}
      <section className="grid gap-6 lg:grid-cols-2" aria-label="배출 데이터 차트">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>배출량 추이</CardTitle>
            <CardDescription>월별 배출원별 배출량 변화 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsLineChart data={emissions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>배출원별 구성</CardTitle>
            <CardDescription>시간에 따른 배출원별 기여도</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsAreaChart data={emissions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>회사별 배출량</CardTitle>
            <CardDescription>회사별 배출원별 배출량 비교</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyEmissionsBarChart companies={companies} />
          </CardContent>
        </Card>
      </section>

      {/* 회사 통계 카드 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="회사/포스트 통계">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 회사</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🏢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">전체 회사 수</p>
            <Link href="/companies" className="text-xs text-primary underline mt-2 inline-block">
              상세보기
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 포스트</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📝</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">전체 포스트 수</p>
            <Link href="/posts" className="text-xs text-primary underline mt-2 inline-block">
              상세보기
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* 최근 포스트/회사 목록은 통계 카드에서 상세페이지 링크로 대체됨 */}
    </div>
  );
}
