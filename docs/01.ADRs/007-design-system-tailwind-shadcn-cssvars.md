# ADR 007: HanaLoop 브랜드 디자인 시스템 적용

## 배경

- HanaLoop은 탄소중립 플랫폼을 제공하는 클라이밋테크 기업으로, 지속가능성과 환경을 핵심 가치로 하는 브랜드임
- 과제 요구사항에 따라 HanaLoop 브랜드 아이덴티티를 반영한 일관된 디자인 시스템을 적용해야 함
- 전문적이고 신뢰할 수 있는 느낌을 연출하면서 환경 친화적인 브랜드 이미지를 표현해야 함

## 결정

### 1. **HanaLoop 브랜드 컬러 시스템 적용**

- **Primary**: `#16a34a` (green-600) - 메인 브랜드 컬러, 지속가능성과 환경을 상징
- **Primary Light**: `#22c55e` (green-500) - 호버 효과 및 액센트용
- **Secondary**: `#14b8a6` (teal-500) - 기술과 혁신을 상징하는 보조 컬러
- **Accent**: `#eab308` (yellow-500) - 에너지와 활력을 표현하는 포인트 컬러

### 2. **탄소관리 전용 컬러 팔레트**

- **Carbon Neutral**: `#6b7280` (gray-500) - 탄소 중립 상태
- **Carbon Reduction**: `#22c55e` (green-500) - 탄소 감축
- **Carbon Emission**: `#f97316` (orange-500) - 탄소 배출
- **Carbon Offset**: `#84cc16` (lime-500) - 탄소 상쇄
- **Forest Protection**: `#166534` (green-800) - 산림 보호
- **Ocean Protection**: `#0891b2` (cyan-600) - 해양 보호

### 3. **기술 구현 방식**

- **TailwindCSS v4 @theme 블록**: CSS 변수 기반 컬러 시스템 정의
- **@custom-variant dark**: 다크모드 변형 정의
- **shadcn/ui 컴포넌트**: 브랜드 컬러를 활용한 일관된 UI 컴포넌트
- **웹 접근성 준수**: WCAG 2.1 AA 기준을 만족하는 컬러 대비율

### 4. **중성색 팔레트**

- **Slate 계열**: 전문적이고 신뢰할 수 있는 느낌의 중성색
- **라이트모드**: `slate-50` ~ `slate-900` 그라데이션
- **다크모드**: `slate-900` ~ `slate-50` 역순 그라데이션

## 근거

### 브랜드 아이덴티티 부합성

- **SYNERGISTIC**: 조화로운 컬러 조합으로 협업과 시너지를 표현
- **BOLD**: 대담한 그린 컬러로 두려움 없는 도전 정신 표현
- **RELIABLE**: 슬레이트 계열 중성색으로 신뢰성과 전문성 표현

### 기술적 근거

- TailwindCSS v4의 최신 @theme 블록 활용으로 성능 최적화
- CSS 변수 기반 시스템으로 다크모드 지원 및 테마 변경 용이성
- shadcn/ui와의 완벽한 호환성으로 개발 효율성 극대화

### 사용자 경험 고려

- 높은 컬러 대비율로 가독성 향상
- 직관적인 컬러 의미로 사용자 인지 부하 감소
- 일관된 브랜드 경험으로 신뢰도 향상

## 구현 세부사항

```css
/* HanaLoop Brand Colors - Light Mode */
--color-primary: #16a34a;           /* Main brand green */
--color-secondary: #14b8a6;         /* Innovation teal */
--color-accent: #eab308;            /* Energy yellow */
--color-success: #22c55e;           /* Success green */
--color-warning: #f59e0b;           /* Warning amber */
--color-destructive: #ef4444;       /* Error red */

/* HanaLoop Brand Colors - Dark Mode */
--color-primary: #22c55e;           /* Brighter green for dark */
--color-secondary: #0891b2;         /* Cyan for dark */
--color-accent: #fbbf24;            /* Brighter yellow for dark */
```

## 이력

- 2025-10-04: 최초 결정 및 ADR 작성
- 2025-10-04: HanaLoop 브랜드 컬러 시스템 적용
- 2025-10-04: 탄소관리 전용 컬러 팔레트 추가

## 참고

- [HanaLoop 공식 웹사이트](https://www.hanaloop.com)
- TailwindCSS v4 공식 문서
- WCAG 2.1 웹 접근성 가이드라인
- shadcn/ui 디자인 시스템
