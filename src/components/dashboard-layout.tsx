'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

import logo from '../../public/logo.png';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 현재 경로에 맞는 내비게이션 아이템 찾기
  const currentNavItem = navigation.find((item) => item.href === pathname) || navigation[0];
  const CurrentIcon = currentNavItem.icon;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <nav
        className={cn(
          'fixed inset-y-0 left-0 bg-gradient-to-b from-sidebar via-sidebar/95 to-sidebar/90 backdrop-blur-xl border-r border-sidebar-border shadow-2xl md:block hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
        aria-label="사이드바 내비게이션"
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div
            className={cn(
              'flex h-16 items-center border-b border-sidebar-border/50 px-3 bg-gradient-to-r from-primary/10 to-transparent',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            {isCollapsed ? (
              /* Collapsed state - only toggle button */
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors duration-200 flex-shrink-0 cursor-pointer"
                aria-label="사이드바 펼치기"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ) : (
              <>
                {/* Expanded state - logo and title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Image
                      src={logo}
                      alt="HanaLoop Logo"
                      width={40}
                      height={40}
                      className="object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    HanaLoop
                  </h1>
                </div>
                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors duration-200 flex-shrink-0 cursor-pointer"
                  aria-label="사이드바 접기"
                >
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </button>
              </>
            )}
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
                    'flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer',
                    isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25 scale-[1.02]'
                      : 'text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/50 hover:text-sidebar-foreground hover:shadow-md hover:scale-[1.01]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-muted-foreground'
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            {!isCollapsed ? (
              <p className="text-xs text-muted-foreground">
                © 2024 HanaLoop
                <br />
                탄소 배출 관리 시스템
              </p>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">H</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out',
          isCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-10 border-b border-border/50 bg-gradient-to-r from-background via-background/95 to-background/90 backdrop-blur-xl shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <CurrentIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {currentNavItem.name}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {currentNavItem.description}
                </p>
              </div>
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
        <main className="p-6 bg-gradient-to-br from-background via-background/98 to-muted/20 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
