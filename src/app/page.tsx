export default function Home() {
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
            <p className="text-3xl font-bold">1,234.5</p>
            <p className="text-xs text-muted-foreground">tons CO2e</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">등록 회사</h3>
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">companies</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">최근 업데이트</h3>
            <p className="text-3xl font-bold">2024-10</p>
            <p className="text-xs text-muted-foreground">year-month</p>
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
          </ul>
        </div>
      </div>
    </main>
  );
}
