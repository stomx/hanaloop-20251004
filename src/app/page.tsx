import { Building2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCompanies } from '@/lib/api';
import { formatNumber, getTotalEmissions } from '@/lib/data-utils';

export default async function Home() {
  const companies = await fetchCompanies();
  const totalEmissions = getTotalEmissions(companies);
  // 최신 월 배출량 등 추가 통계 필요시 getLatestMonth/getEmissionsForMonth 활용 가능

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="mt-2 text-muted-foreground">
          기업의 탄소 배출량을 실시간으로 모니터링하고 관리합니다.
        </p>
      </header>

      {/* 통계 카드 영역 */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="통계 카드">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 배출량</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-label="총 배출량 아이콘" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalEmissions)}</div>
            <p className="text-xs text-muted-foreground">tons CO2e</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">등록 회사</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" aria-label="등록 회사 아이콘" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">companies</p>
          </CardContent>
        </Card>
      </section>

      {/* 회사 목록 카드 */}
      <section aria-label="회사 목록">
        <Card>
          <CardHeader>
            <CardTitle>회사 목록</CardTitle>
            <CardDescription>등록된 상위 5개 회사</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companies.slice(0, 5).map((company) => (
                <div key={company.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-sm">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">{company.emissions.length}</p>
                    <p className="text-xs text-muted-foreground">records</p>
                  </div>
                </div>
              ))}
              {companies.length > 5 && (
                <p className="pt-2 text-center text-sm text-muted-foreground">
                  ... and {companies.length - 5} more companies
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
