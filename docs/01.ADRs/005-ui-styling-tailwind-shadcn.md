# ADR-005: UI 스타일링 및 컴포넌트 라이브러리 선택 (Tailwind CSS, shadcn/ui)

## 상태 (Status)

승인됨 (Accepted)

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

**설정 예시:**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
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

**컬러 시스템 (탄소 배출 대시보드 테마):**

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    --primary: 221.2 83.2% 53.3%;     /* 파란색 - 신뢰감 */
    --primary-foreground: 210 40% 98%;
    
    --secondary: 142.1 76.2% 36.3%;   /* 녹색 - 친환경 */
    --secondary-foreground: 355.7 100% 97.3%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    --accent: 142.1 76.2% 36.3%;      /* 강조색 */
    --accent-foreground: 222.2 47.4% 11.2%;
    
    --destructive: 0 84.2% 60.2%;     /* 경고/삭제 */
    --destructive-foreground: 210 40% 98%;
    
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode colors */
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
- [shadcn/ui 공식 사이트](https://ui.shadcn.com/)
- [Radix UI 문서](https://www.radix-ui.com/)
- [Next.js + Tailwind 가이드](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)
- [프로젝트 기술 요구사항](../00.requirements/04.technical-requirements.md)
- [프로젝트 디자인 요구사항](../00.requirements/05.design-requirements.md)
