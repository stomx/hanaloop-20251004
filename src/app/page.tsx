import { fetchCompanies } from '@/lib/api';
import {
  formatNumber,
  getEmissionsForMonth,
  getLatestMonth,
  getTotalEmissions,
} from '@/lib/data-utils';

export default async function Home() {
  const companies = await fetchCompanies();
  const totalEmissions = getTotalEmissions(companies);
  const latestMonth = getLatestMonth(companies);
  const latestMonthEmissions = latestMonth ? getEmissionsForMonth(companies, latestMonth) : 0;

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">탄소 배출 대시보드</h1>
          <p className="text-lg text-muted-foreground">
            기업의 탄소 배출량을 시각화하고 관리하는 대시보드입니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">총 배출량</h3>
            <p className="text-3xl font-bold">{formatNumber(totalEmissions)}</p>
            <p className="text-xs text-muted-foreground">tons CO2e</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">등록 회사</h3>
            <p className="text-3xl font-bold">{companies.length}</p>
            <p className="text-xs text-muted-foreground">companies</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">최근 월 배출량</h3>
            <p className="text-3xl font-bold">{formatNumber(latestMonthEmissions)}</p>
            <p className="text-xs text-muted-foreground">{latestMonth || 'N/A'} (tons CO2e)</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">설정 완료 ✅</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Tailwind CSS 설정 완료
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> shadcn/ui 기본 설정 완료
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> 디자인 시스템 준비 완료
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> 데이터 모델 및 타입 정의 완료
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Fake Backend API 구현 완료
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> 시드 데이터 ({companies.length}개 회사) 준비
              완료
            </li>
          </ul>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">회사 목록</h2>
          <div className="space-y-2">
            {companies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.country}</p>
                </div>
                <p className="text-sm font-mono">{company.emissions.length} records</p>
              </div>
            ))}
            {companies.length > 5 && (
              <p className="pt-2 text-center text-sm text-muted-foreground">
                ... and {companies.length - 5} more companies
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
