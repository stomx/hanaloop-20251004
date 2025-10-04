'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <nav
        className="fixed inset-y-0 left-0 w-64 border-r bg-card md:block hidden"
        aria-label="사이드바 내비게이션"
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold text-primary">HanaLoop</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1 px-3 py-4" aria-label="메인 내비게이션">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={cn('h-5 w-5', isActive ? 'text-white' : 'text-muted-foreground')}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">
              © 2024 HanaLoop
              <br />
              탄소 배출 관리 시스템
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h2 className="text-lg font-semibold">탄소 배출 대시보드</h2>
              <p className="text-xs text-muted-foreground">실시간 배출량 모니터링 및 관리</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
