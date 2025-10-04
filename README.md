# 탄소 배출 대시보드 (HanaLoop)

기업의 탄소(온실가스) 배출 데이터를 시각화하고, 관련 포스트(보고/공지)를 관리하는
Next.js 14 기반 대시보드입니다. 가짜 백엔드를 통해 네트워크 지연과 실패를 시뮬레이션하여
로딩·에러·롤백 등 현실적인 UX/상태 처리를 검증할 수 있습니다.

## 주요 기능

- 대시보드 요약 카드(총배출, 주요 배출원, 회사 수, 배출원 종류)
- 3종 차트(Line/Area/Stacked Bar)로 배출 추이·구성·회사별 비교
- 회사 목록 테이블(확장 행으로 연월·배출원 상세 및 소계)
- 포스트 목록/상세/생성/수정/삭제, 회사/연월 필터, 삭제 낙관적 업데이트
- 가짜 백엔드: 지연(200–800ms), 부분 실패(15%), 입력 검증, 인메모리 저장

## 라우트(화면)

- `/` 대시보드 요약 및 차트: src/app/page.tsx:10
- `/emissions` 배출 현황 상세 차트: src/app/emissions/page.tsx:13
- `/companies` 회사 목록/확장 상세: src/app/companies/page.tsx:1
- `/posts` 포스트 목록·필터·CRUD: src/app/posts/page.tsx:1

## 설치 및 실행

요구 사항: Node.js 18+, pnpm 10.x

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 타입 검사만 수행
pnpm build:check

# 프로덕션 빌드/실행
pnpm build && pnpm start

# 코드 품질 (린트/포맷/마크다운)
pnpm lint && pnpm format && pnpm lint:md
```

테스트: 현재 저장소에는 별도의 테스트 스크립트가 없습니다.
향후 `lib/api.ts`와 테이블 페이징/필터에 대한 단위 테스트를 추가할 계획입니다.

## 기술 스택

- Next.js 14(App Router), React 18, TypeScript(strict)
- Tailwind CSS v4(CSS 변수 기반 토큰), Radix Primitives(headless UI)
- Recharts(차트), @tanstack/react-table(테이블), @tanstack/react-form(폼)

## 프로젝트 구조

```text
src/
  app/                  # App Router(레이아웃/페이지/로딩)
  components/           # UI, 차트, 도메인 컴포넌트
    charts/             # Recharts 기반 차트 컴포넌트
    posts/              # 포스트 관련 컴포넌트(목록/폼/상세)
    companies/          # 회사 리스트 및 확장 상세
    ui/                 # 경량 UI 구성요소(Card/Dialog/Button/Toast)
  lib/                  # 가짜 백엔드, 유틸, 내비게이션, 시드 데이터
    seed-data/          # companies/countries/emissions/posts
  types/                # 데이터 모델 타입 정의
```

## 데이터 모델

- `Company`, `GhgEmission`, `Post` 타입은 `src/types/index.ts`에 정의되어 있습니다.
- 포스트 생성/수정 시 `CreatePostInput`, `UpdatePostInput`을 사용합니다.
- 시드 데이터는 `src/lib/seed-data/*`에서 로드됩니다.

## 가짜 백엔드(lib/api.ts)

- 인메모리 저장소에 국가/회사/배출/포스트를 보관합니다.
- 지연(200–800ms)과 15% 변이 실패를 시뮬레이션합니다.
- 입력 검증과 존재성 체크를 수행합니다.
- CRUD
  - 읽기: `fetchCountries`, `fetchCompanies`, `fetchGhgEmissions`, `fetchPosts`
  - 쓰기: `createPost`, `updatePost`, `deletePost`(실패 시 에러 발생 가능)
- 참고 파일: src/lib/api.ts:16, src/lib/api.ts:107, src/lib/api.ts:147, src/lib/api.ts:188

주의: 인메모리 특성상 페이지 새로고침이나 서버 재시작 시 데이터가 초기화됩니다.

## 아키텍처 개요

- 구성
  - 레이아웃/내비게이션: `src/components/dashboard-layout.tsx`
  - 대시보드/회사: 서버 컴포넌트 페이지에서 데이터 조회
  - 배출/포스트: 클라이언트 컴포넌트에서 CSR 상태 관리 및 상호작용
- 상태 경계
  - 레이아웃/라우팅 상태와 데이터 상태를 분리
  - `PostList`는 목록 데이터·필터·모달·페이지네이션 상태를 로컬로 관리
- 데이터 흐름
  - 읽기: API → 페이지/컴포넌트 → 파생 통계(총배출/주요 배출원) 계산 후 표시
  - 쓰기: 폼/버튼 → API → 성공 시 재조회 또는 낙관적 업데이트
  - 삭제는 낙관적 업데이트 후 실패 시 스냅샷으로 롤백
- 렌더링 전략
  - 홈 전역 로딩 스켈레톤: `src/app/loading.tsx`
  - 차트는 클라이언트 컴포넌트로 격리하여 상호작용과 툴팁 제공

## 렌더링 효율성 메모

- 대시보드 요약 통계는 한 번의 reduce로 계산 후 표시합니다.
- `PostList`는 `useMemo`로 회사 맵, 페이지 슬라이스를 계산합니다.
- `useCallback`으로 `loadPosts`를 안정화하고, 필터 변경 시에만 재호출합니다.
- 차트 시리즈 목록과 툴팁은 입력 데이터로부터 동적으로 파생됩니다.

## 시간 제약과 트레이드오프

- 테스트는 보류하여 핵심 UI/상호작용에 집중했습니다.
- 낙관적 업데이트는 삭제에 우선 적용하여 UX를 개선했습니다.
- 알림은 경량 토스트로 통일하고, alert는 제거했습니다.
- 영속 저장 대신 인메모리 저장으로 단순화했습니다.

## 디자인 근거

- CSS 변수 기반 토큰으로 일관된 색/간격/음영을 유지합니다.
- 사이드바 + 상단 헤더 조합으로 정보 구조와 맥락을 제공합니다.
- Recharts 선택으로 선언적 차트 구성과 빠른 개발을 달성했습니다.
- 접근성: label 연결, 포커스 링, 토스트 `aria-live`로 보조 기술 친화성 확보.

## 참고 문서

- ADR: `docs/01.ADRs/*` (스택 선택, 디자인 시스템, 폼/차트 결정 등)
- 과제 원문: `docs/99.original/hanaloop-assignment-requirements-Korean.md`
