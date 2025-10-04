import { Building2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCompanies } from '@/lib/api';
import { formatNumber, getTotalEmissions } from '@/lib/data-utils';

export default async function Home() {
  const companies = await fetchCompanies();
  const totalEmissions = getTotalEmissions(companies);
  // 최신 월 배출량 등 추가 통계 필요시 getLatestMonth/getEmissionsForMonth 활용 가능

  return (
    <div className="space-y-6">
      {/* 통계 카드 영역 */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="통계 카드">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-destructive/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-destructive/5"></div>
          <CardHeader className="relative flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-bold text-foreground">총 배출량</CardTitle>
            <div className="p-3 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-destructive" aria-label="총 배출량 아이콘" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">
              {formatNumber(totalEmissions)}
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-1">tons CO2e</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
          <CardHeader className="relative flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-bold text-foreground">등록 회사</CardTitle>
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full">
              <Building2 className="h-5 w-5 text-primary" aria-label="등록 회사 아이콘" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {companies.length}
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-1">companies</p>
          </CardContent>
        </Card>
      </section>

      {/* 회사 목록 카드 */}
      <section aria-label="회사 목록">
        <Card className="border-0 bg-gradient-to-br from-card via-card/95 to-muted/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-muted/50 via-transparent to-muted/30 border-b border-border/50">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              회사 목록
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              등록된 상위 5개 회사의 배출 데이터
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {companies.slice(0, 5).map((company, index) => (
                <div
                  key={company.id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-background via-background/95 to-muted/10 border border-border/50 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {company.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">{company.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{company.emissions.length}</p>
                    <p className="text-xs text-muted-foreground font-medium">records</p>
                  </div>
                </div>
              ))}
              {companies.length > 5 && (
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-full inline-block">
                    ... and {companies.length - 5} more companies
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
