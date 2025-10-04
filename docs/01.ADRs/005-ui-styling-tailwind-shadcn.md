# ADR-005: UI 스타일링 및 컴포넌트 라이브러리 선택 (Tailwind CSS v4, shadcn/ui)

## 상태 (Status)

구현됨 (Implemented)

## 맥락 (Context)

탄소 배출 대시보드 프로젝트의 UI를 구현하기 위해 스타일링 솔루션과 UI 컴포넌트
라이브러리를 선택해야 합니다.

### 프로젝트 요구사항

**평가 기준 (UI/UX 디자인 25%):**

- 현대적이고 깔끔한 디자인
- 직관적인 사용자 경험
- 일관된 디자인 시스템
- 반응형 디자인

**기술 요구사항:**

- Next.js 14 (App Router) 호환
- React 18 Server Components 지원
- TypeScript 지원
- 빠른 개발 속도

**제약사항:**

- ❌ 무거운 UI 라이브러리 금지 (Material-UI, Ant Design)
- ✅ 소형/headless UI 라이브러리 허용
- 8-12시간의 제한된 개발 시간

### 평가 대상 솔루션들

**스타일링 접근법:**

1. **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
2. **CSS Modules**: Next.js 기본 지원
3. **Styled Components**: CSS-in-JS
4. **Emotion**: CSS-in-JS

**UI 컴포넌트 라이브러리:**

1. **shadcn/ui**: 복사 가능한 컴포넌트 모음
2. **Radix UI**: Headless UI 컴포넌트
3. **Headless UI**: Tailwind Labs의 headless 컴포넌트
4. **React Aria**: Adobe의 접근성 우선 컴포넌트

### 평가 기준

- **개발 속도**: 빠른 프로토타이핑 가능
- **디자인 품질**: 현대적이고 전문적인 외관
- **유지보수성**: 코드 재사용 및 일관성
- **번들 크기**: 성능 영향 최소화
- **접근성**: WCAG 준수
- **TypeScript 지원**: 타입 안전성

## 결정 (Decision)

**Tailwind CSS + shadcn/ui 조합을 선택합니다.**

### 1. Tailwind CSS (스타일링 프레임워크)

**선택 근거:**

#### 빠른 개발 속도

- **유틸리티 클래스**: HTML을 떠나지 않고 스타일링
- **자동완성**: IDE에서 클래스명 자동완성 지원
- **반응형**: 간단한 prefix로 반응형 디자인 구현

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md
                hover:shadow-lg transition-shadow md:p-6 lg:p-8">
  {/* 반응형, hover, 간격, 그림자 모두 한 줄로 */}
</div>
```

#### 일관된 디자인 시스템

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        danger: '#ef4444',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
      },
    },
  },
};
```

#### 성능 최적화

- **JIT (Just-In-Time)**: 사용하는 클래스만 생성
- **트리 쉐이킹**: 미사용 스타일 자동 제거
- **작은 번들**: 프로덕션에서 최소화된 CSS

#### Next.js 통합

- Next.js에서 공식 지원
- App Router와 완벽 호환
- Server Components에서 사용 가능

**설정 예시 (Tailwind CSS v4):**

Tailwind CSS v4에서는 JavaScript 기반 설정 파일 대신 CSS 기반 구성을 사용합니다:

```javascript
// postcss.config.mjs
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

```css
/* app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

### 2. shadcn/ui (UI 컴포넌트)

**선택 근거:**

#### 소유권과 커스터마이징

- **복사 가능**: npm 패키지가 아닌 소스 코드 복사
- **완전한 제어**: 필요에 따라 자유롭게 수정 가능
- **의존성 최소화**: 무거운 라이브러리 번들 없음

```bash
# 필요한 컴포넌트만 추가
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

#### 고품질 컴포넌트

- **Radix UI 기반**: 접근성과 기능성 보장
- **현대적 디자인**: 세련되고 전문적인 UI
- **일관된 스타일**: Tailwind CSS와 완벽 통합

#### TypeScript 우선

```tsx
// components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### 접근성

- **ARIA 속성**: 자동으로 포함
- **키보드 내비게이션**: 완전 지원
- **스크린 리더**: 최적화된 경험

#### 풍부한 컴포넌트 라이브러리

```bash
# 대시보드에 필요한 컴포넌트들
- Button, Card, Input, Select, Dropdown
- Dialog, Sheet, Popover, Tooltip
- Table, Tabs, Accordion
- Chart (Recharts 통합)
```

### 프로젝트 적용 계획

**필수 컴포넌트:**

```bash
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet  # 사이드바용
npx shadcn@latest add separator
npx shadcn@latest add badge
npx shadcn@latest add skeleton  # 로딩 상태
npx shadcn@latest add toast  # 알림
```

**디렉토리 구조:**

```text
src/
├── components/
│   ├── ui/              # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   └── features/        # 기능별 컴포넌트
│       ├── dashboard/
│       ├── charts/
│       └── posts/
└── lib/
    └── utils.ts         # cn() 유틸리티
```

**컬러 시스템 (HanaLoop 탄소 배출 대시보드 테마):**

```css
/* app/globals.css */
:root {
  --radius: 0.625rem;
  --background: #ffffff;
  --foreground: #1f2937;
  --card: #ffffff;
  --card-foreground: #1f2937;
  --popover: #ffffff;
  --popover-foreground: #1f2937;
  /* HanaLoop Brand Color */
  --primary: #0398ed;
  --primary-foreground: #fafafa;
  --secondary: #f9fafb;
  --secondary-foreground: #374151;
  --muted: #f9fafb;
  --muted-foreground: #6b7280;
  --accent: #f9fafb;
  --accent-foreground: #374151;
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  /* Success: Green */
  --success: #22c55e;
  --success-foreground: #fafafa;
  /* Warning: Orange */
  --warning: #f97316;
  --warning-foreground: #1f2937;
  /* Danger: Red (alias for destructive) */
  --danger: #ef4444;
  --danger-foreground: #fafafa;
  --border: #e5e7eb;
  --input: #e5e7eb;
  --ring: #0398ed;
  /* Chart colors - using HanaLoop brand and complementary colors */
  --chart-1: #0398ed;
  --chart-2: #8b5cf6;
  --chart-3: #10b981;
  --chart-4: #d946ef;
  --chart-5: #84cc16;
  --sidebar: #fafafa;
  --sidebar-foreground: #1f2937;
  --sidebar-primary: #0398ed;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #f9fafb;
  --sidebar-accent-foreground: #374151;
  --sidebar-border: #e5e7eb;
  --sidebar-ring: #0398ed;
}

.dark {
  --background: #1f2937;
  --foreground: #fafafa;
  --card: #374151;
  --card-foreground: #fafafa;
  --popover: #374151;
  --popover-foreground: #fafafa;
  /* HanaLoop Brand Color for dark mode */
  --primary: #0ea5e9;
  --primary-foreground: #1f2937;
  --secondary: #4b5563;
  --secondary-foreground: #fafafa;
  --muted: #4b5563;
  --muted-foreground: #9ca3af;
  --accent: #4b5563;
  --accent-foreground: #fafafa;
  --destructive: #f87171;
  --destructive-foreground: #1f2937;
  /* Success: Green (darker for dark mode) */
  --success: #16a34a;
  --success-foreground: #1f2937;
  /* Warning: Orange (darker for dark mode) */
  --warning: #ea580c;
  --warning-foreground: #1f2937;
  /* Danger: Red (darker for dark mode) */
  --danger: #f87171;
  --danger-foreground: #1f2937;
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.15);
  --ring: #0ea5e9;
  /* Chart colors for dark mode */
  --chart-1: #0ea5e9;
  --chart-2: #a78bfa;
  --chart-3: #34d399;
  --chart-4: #e879f9;
  --chart-5: #a3e635;
  --sidebar: #374151;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #0ea5e9;
  --sidebar-primary-foreground: #1f2937;
  --sidebar-accent: #4b5563;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #0ea5e9;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 결과 (Consequences)

### 긍정적 결과

#### 개발 생산성

- ✅ **빠른 프로토타이핑**: 유틸리티 클래스로 즉시 스타일링
- ✅ **재사용 가능**: 컴포넌트 복사 후 커스터마이징
- ✅ **일관성**: 디자인 토큰으로 통일된 UI

#### 코드 품질

- ✅ **타입 안전성**: TypeScript 완벽 지원
- ✅ **유지보수**: 명확한 컴포넌트 구조
- ✅ **테스트 용이**: 표준 React 컴포넌트

#### 사용자 경험

- ✅ **접근성**: WCAG 2.1 AA 준수
- ✅ **반응형**: 모바일부터 데스크톱까지 대응
- ✅ **성능**: 최적화된 CSS 번들

#### 프로젝트 평가

- ✅ **현대적 디자인**: 평가 기준 충족
- ✅ **제약사항 준수**: 무거운 라이브러리 미사용
- ✅ **전문성**: 업계 표준 도구 사용

### 잠재적 이슈

#### 학습 곡선

- ⚠️ **Tailwind 문법**: 유틸리티 클래스 익숙해지기 필요
- ⚠️ **컴포넌트 구조**: shadcn/ui 패턴 이해 필요

#### 초기 설정

- ⚠️ **설정 파일**: tailwind.config.js, postcss.config.js
- ⚠️ **CSS 변수**: globals.css에 디자인 토큰 정의

#### 커스터마이징

- ⚠️ **복잡한 디자인**: 때때로 유틸리티 클래스 조합이 길어짐
- ⚠️ **컴포넌트 수정**: 필요시 복사된 코드 직접 수정

### 완화 전략

#### 개발 효율화

```typescript
// lib/utils.ts - 클래스 조합 유틸리티
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 재사용 컴포넌트

```tsx
// components/common/PageHeader.tsx
export function PageHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
```

#### IDE 설정

```json
// .vscode/settings.json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 대안 평가

### CSS Modules (거절됨)

**장점:**

- Next.js 기본 지원
- 스코프된 CSS
- 전통적 CSS 작성

**단점:**

- 느린 개발 속도
- 별도 파일 관리 필요
- 유틸리티 패턴 부재

**거절 이유:**

- 제한된 시간에 비효율적
- 디자인 시스템 구축 어려움
- 반응형 처리 복잡

### Material-UI (제약사항 위반)

**제약사항:**

- ❌ 과제 요구사항에서 명시적으로 금지
- ❌ 무거운 번들 크기
- ❌ 커스터마이징 제한적

### Chakra UI (거절됨)

**장점:**

- 컴포넌트 기반
- 접근성 우수
- TypeScript 지원

**단점:**

- 번들 크기 큼 (shadcn/ui보다)
- 디자인 커스터마이징 복잡
- 의존성 많음

**거절 이유:**

- shadcn/ui가 더 가볍고 유연
- 소유권과 제어 측면에서 열위

## 관련 자료 (References)

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Beta 문서](https://tailwindcss.com/docs/v4-beta)
- [shadcn/ui 공식 사이트](https://ui.shadcn.com/)
- [Radix UI 문서](https://www.radix-ui.com/)
- [Next.js + Tailwind 가이드](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)
- [프로젝트 기술 요구사항](../00.requirements/04.technical-requirements.md)
- [프로젝트 디자인 요구사항](../00.requirements/05.design-requirements.md)

## 구현 내역 (Implementation)

### 날짜

2024-10-04

### 설치된 패키지

```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.544.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.14",
    "tailwindcss": "^4.1.14"
  }
}
```

### 구현된 구성

#### 1. PostCSS 설정 (postcss.config.mjs)

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

#### 2. Tailwind CSS v4 구성 (src/app/globals.css)

- `@import "tailwindcss"` 사용
- `@theme inline` 블록으로 CSS 변수를 Tailwind 테마로 매핑
- `@custom-variant dark`로 다크 모드 정의
- HanaLoop 브랜드 컬러 (#0398ed) 적용
- 확장된 색상 팔레트 (success, warning, danger) 포함
- 차트 컬러 5개 정의
- Sidebar 컬러 시스템 포함

#### 3. shadcn/ui 설정 (components.json)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

### Tailwind CSS v4의 주요 변경사항

#### 이전 (v3)

- JavaScript 기반 `tailwind.config.js` 필요
- `@tailwind base`, `@tailwind components`, `@tailwind utilities` 디렉티브 사용
- `autoprefixer`, `postcss` 별도 설치 필요

#### 현재 (v4)

- CSS 기반 `@import "tailwindcss"` 사용
- `@theme inline` 블록으로 테마 정의
- `@custom-variant`로 커스텀 변형 정의
- `@tailwindcss/postcss` 플러그인 하나로 통합
- Rust 기반 엔진으로 더 빠른 빌드 속도

### 검증 결과

✅ **빌드 성공**: `pnpm run build` 정상 실행
✅ **린팅 통과**: `pnpm run lint:check` 문제 없음
✅ **CSS 생성 확인**: `.next/static/css/` 에 CSS 파일 생성
✅ **Tailwind 클래스 작동**: 모든 유틸리티 클래스 정상 적용
✅ **색상 시스템 작동**: HanaLoop 브랜드 컬러 및 테마 색상 정상 작동
✅ **다크 모드 지원**: `.dark` 클래스로 다크 모드 전환 가능

### 장점

1. **현대적인 구성 방식**: CSS 기반 구성으로 더 직관적
2. **빠른 빌드 속도**: Rust 기반 엔진으로 성능 향상
3. **간소화된 설정**: JavaScript 설정 파일 제거로 프로젝트 구조 간결
4. **더 나은 타입 안전성**: CSS 변수를 통한 테마 관리
5. **완전한 디자인 시스템**: HanaLoop 브랜드 아이덴티티 반영
