# 탄소 배출 대시보드 - 요구사항 문서

## 프로젝트 개요

HanaLoop 프론트엔드 개발자 과제로, 기업의 탄소 배출량을 시각화하고 관리할 수 있는 웹 기반 대시보드를 구축합니다.

## 목적

이 프로젝트는 임원과 관리자들이:

- 자신들의 회사와 계열사의 배출량을 이해
- 향후 납부해야 할 탄소세를 미리 계획
- 배출량 추세를 분석하고 의사결정에 활용

할 수 있도록 지원하는 것을 목표로 합니다.

## 요구사항 문서 구조

이 폴더에는 과제를 완수하기 위한 모든 요구사항이 체계적으로 정리되어 있습니다.

### 📋 핵심 요구사항

1. **[01.evaluation-criteria.md](./01.evaluation-criteria.md)** - 평가 기준
   - 창의성과 비판적 사고 (25%)
   - UI/UX 디자인과 심미성 (25%)
   - UI 엔지니어링 (20%)
   - 소프트웨어 엔지니어링 (20%)
   - 코드 품질 (10%)

2. **[02.timebox.md](./02.timebox.md)** - 시간 제한
   - 8-12시간 집중 작업, 최대 3일
   - 추천 일정 및 우선순위
   - 시간 관리 전략
   - 리소스 사용 가이드

3. **[03.functional-requirements.md](./03.functional-requirements.md)** - 기능 요구사항
   - 대시보드 홈 페이지
   - 필터링 및 검색
   - 데이터 시각화
   - 포스트 관리 (CRUD)
   - 사용자 시나리오

4. **[04.technical-requirements.md](./04.technical-requirements.md)** - 기술 요구사항
   - 필수 기술 스택 (Next.js 14+, React 18, TypeScript)
   - 스타일링 접근법
   - 상태 관리
   - 데이터 페칭
   - 프로젝트 구조

5. **[05.design-requirements.md](./05.design-requirements.md)** - 디자인/UI 요구사항
   - 디자인 원칙
   - 레이아웃 구조
   - 컬러 팔레트
   - 타이포그래피
   - 반응형 디자인
   - UI 컴포넌트 가이드라인

6. **[06.data-model.md](./06.data-model.md)** - 데이터 모델
   - 타입 정의 (Country, Company, GhgEmission, Post)
   - 시드 데이터 예시
   - 데이터 관계
   - 집계 함수

7. **[07.fake-backend.md](./07.fake-backend.md)** - 가짜 백엔드 구현
   - 네트워크 지연 시뮬레이션 (200-800ms)
   - 실패 시뮬레이션 (10-20%)
   - 완전한 API 구현 예시
   - 사용 예시 (React Query와 함께)

### 📦 산출물 및 제약사항

1. [08.deliverables.md](./08.deliverables.md) - 산출물
   - 실행 가능한 Next.js 앱
   - README.md 작성 가이드
   - Git 저장소 요구사항
   - 추가 문서화 (가정, 아키텍처, 디자인 결정)

## 💡 사용 가이드

**개발 시작 전 읽을 순서**:

1. README.md (현재 위치)
2. 01.evaluation-criteria.md (평가 기준 이해)
3. 02.timebox.md (시간 계획)
4. 03~06 (요구사항 상세)
5. 07~08 (구현 및 제출)

## 핵심 기능 요약

### 필수 (P0)

- ✅ 대시보드 홈 (요약 카드, 차트)
- ✅ 배출량 데이터 시각화
- ✅ 기본 필터링 (회사, 날짜)
- ✅ 가짜 API (지연 + 실패 시뮬레이션)
- ✅ 로딩/에러 상태

### 권장 (P1)

- 포스트 생성/수정
- 다양한 차트 (3종 이상)
- 고급 필터링
- 반응형 디자인
- 낙관적 업데이트

### 선택 (P2)

- 회사 상세 페이지
- 데이터 테이블
- 추가 기능 (Export, 다크모드 등)

## 기술 스택 요약

### 필수

- Next.js 14+ (App Router)
- React 18
- TypeScript

### 제약사항

- ❌ Pages Router 사용 금지
- ❌ 무거운 UI 라이브러리 (MUI, Ant Design) 금지
- ✅ Headless UI, shadcn/ui 같은 소형 라이브러리는 허용

### 권장

- Tailwind CSS (스타일링)
- Zustand 또는 Context API (상태 관리)
- React Query 또는 SWR (데이터 페칭)
- Recharts (차트)

## 평가 기준 요약

| 항목 | 가중치 | 핵심 포인트 |
|------|--------|------------|
| 창의성과 비판적 사고 | 25% | 질문 제기, 가정 문서화, 독창적 아이디어 |
| UI/UX 디자인과 심미성 | 25% | 현대적 디자인, 직관성, 일관성 |
| UI 엔지니어링 | 20% | 반응형, 로딩/에러 처리, 상태 분리 |
| 소프트웨어 엔지니어링 | 20% | 모듈성, 성능, 확장성 |
| 코드 품질 | 10% | 가독성, 타입, 테스트, 커밋 히스토리 |

## 중요한 원칙

### 완벽보다 완성

- 모든 기능을 대충 만드는 것보다 핵심 기능을 잘 만드는 것이 중요
- 시간 제약을 인정하고 우선순위를 정하세요
- 구현하지 못한 부분은 문서화하세요

### 사고 과정 보여주기

- 왜 이런 선택을 했는지 설명
- 가정을 명확히 문서화
- 트레이드오프를 정당화
- 질문을 제기하는 것을 두려워하지 마세요

### 신중한 트레이드오프

평가자들은 완벽한 솔루션을 기대하지 않습니다. 오히려:

- 시간 제약 내에서 무엇을 우선시했는가?
- 왜 그 선택을 했는가?
- 다른 옵션도 고려했는가?

를 중요하게 봅니다.

## 추가 리소스

### 참고할 만한 디자인

- [Vercel Analytics](https://vercel.com/analytics)
- [Linear](https://linear.app)
- [Notion](https://notion.so)

### 유용한 라이브러리

- **Charts**: Recharts, Chart.js, D3.js
- **UI**: Radix UI, Headless UI, shadcn/ui
- **State**: Zustand, Redux Toolkit
- **Data Fetching**: React Query, SWR
- **Styling**: Tailwind CSS, CSS Modules

### 학습 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [React Query 튜토리얼](https://tanstack.com/query/latest/docs/react/overview)
- [Recharts 예시](https://recharts.org/en-US/examples)

## 질문이 있나요?

과제를 진행하면서 모호한 부분이 있다면 **질문하는 것을 권장**합니다. 이는 비판적 사고를 보여주는 좋은 방법입니다.

예시 질문:

- "포스트는 회사당 월별로 여러 개 작성 가능한가요?"
- "필터는 AND 로직인가요, OR 로직인가요?"
- "데이터를 localStorage에 저장해야 하나요?"

## 시작하기

준비되셨나요? 다음 단계로 이동하세요:

1. [01.evaluation-criteria.md](./01.evaluation-criteria.md)를 읽고 평가 기준 이해
2. [02.timebox.md](./02.timebox.md)로 시간 계획 수립
3. 코딩 시작!

### 행운을 빕니다! 🚀

---

_이 문서는 HanaLoop 프론트엔드 개발자 과제의 일부입니다._
