# ADR-009: Post 생성/수정 폼 라이브러리로 @tanstack/react-form 선택

## 상태 (Status)

구현됨 (Implemented)

## 맥락 (Context)

탄소 배출 대시보드의 포스트 생성/수정 기능을 구현하기 위해,
폼 상태 관리와 유효성 검사, 에러 처리, 접근성, 타입 안전성을 모두 만족하는 라이브러리가 필요했다.
Next.js 14+ App Router, React 18, TypeScript 환경에서 최신 폼 라이브러리의 장단점을 비교·평가했다.

### 프로젝트 요구사항

- 타입 안전한 폼 데이터 처리
- 동적 유효성 검사 및 에러 메시지
- 서버/클라이언트 유효성 검사 통합
- 낙관적 UI, 로딩/에러 상태 관리
- 접근성(aria, 포커스 관리) 준수
- 유지보수성, 확장성

### 평가 대상 라이브러리

- React Hook Form
- Formik
- Final Form
- @tanstack/react-form

## 평가 기준

- 타입 안전성(TypeScript)
- 유효성 검사(동기/비동기)
- 서버 액션/SSR 지원
- 에러/로딩/상태 관리
- 접근성(aria, 포커스, 에러 표시)
- Next.js App Router 호환성
- 개발자 경험(코드량, 확장성)

## 결정 (Decision)

**@tanstack/react-form을 Post 생성/수정 폼의 상태 관리 및 유효성 검사 라이브러리로 선택한다.**

### 선택 근거

#### 1. 타입 안전성과 유연성

- 모든 폼 필드와 값이 TypeScript로 강제됨
- 폼 구조, 유효성 검사, 에러 타입까지 완전 타입 추론
- 동적 필드, 배열, 중첩 구조도 타입 안전하게 처리

#### 2. 유효성 검사 및 에러 처리

- onChange, onBlur, onDynamic 등 다양한 validator 지원
- 동기/비동기 유효성 검사, 서버 액션과 통합 가능
- errorMap을 통한 상세 에러 메시지 관리
- 첫 에러 필드 자동 포커스 등 UX 강화

#### 3. Next.js/React 최신 패턴 지원

- App Router, 서버 액션, useActionState와 통합
- 클라이언트/서버 유효성 검사 분리 및 통합
- 낙관적 UI, 로딩/에러/상태 관리 패턴 내장

#### 4. 접근성 및 UX

- aria-invalid, aria-describedby, 포커스 관리 등 접근성 강화
- 에러 발생 시 첫 입력 자동 포커스
- 폼 상태 변화에 따른 버튼 비활성화, 에러 메시지 실시간 표시

#### 5. 개발자 경험 및 확장성

- Headless 구조로 UI/스타일 자유롭게 커스터마이즈
- 코드량 최소화, 유지보수성/확장성 우수
- 공식 문서/예제 풍부, 커뮤니티 성장 중

## 결과 (Consequences)

- ✅ 타입 안전한 폼 구현으로 런타임 오류 최소화
- ✅ 동적 유효성 검사, 서버 액션, 에러/로딩/낙관적 UI 모두 지원
- ✅ 접근성(aria, 포커스) 및 UX 베스트 프랙티스 준수
- ✅ Next.js App Router, React 18, TypeScript 환경에 최적화
- ✅ 유지보수성, 확장성, 테스트 용이성 확보

## 트레이드오프 및 잠재적 이슈

- ⚠️ 비교적 새로운 라이브러리로 커뮤니티/레퍼런스가 React Hook Form, Formik 대비 적음
- ⚠️ Headless 구조로 인해 UI 직접 구현 필요(초기 진입장벽)
- ⚠️ 복잡한 폼 구조에서는 타입 추론/확장에 추가 학습 필요

## 완화 전략

- 공식 문서/예제 적극 활용, 내부 가이드 문서화
- 폼 UI/UX 패턴을 컴포넌트로 분리해 재사용성 강화
- 테스트 코드/스토리북 등으로 폼 동작 검증

## 구현 세부 패턴 및 Best Practice

- **필드별 validator 적용**
  - 각 입력 필드에 onChange 기반 validator를 적용하여 즉각적 에러 메시지와 UX를 강화함. 서버/클라이언트 유효성 검사를 분리해 에러 원인 명확화.
- **useId를 통한 접근성 강화**
  - label/input 연결, aria-describedby/id 자동 생성으로 스크린리더 호환성 및 접근성(Accessibility) 보장.
- **타입가드 및 any 제거**
  - 모든 폼/핸들러에서 unknown 타입 처리 및 타입가드 적용, any 사용 금지로 빌드/런타임 오류 예방.
- **SSR/CSR 경계 안전성**
  - 이벤트 핸들러 전달/호출 시 SSR/CSR 경계에서 안전하게 동작하도록 설계, Next.js App Router의 서버/클라이언트 분리 원칙 준수.
- **빌드/린트 오류 예방**
  - biome, TypeScript, commitlint 등 도구를 활용해 코드 품질 및 일관성 유지, 모든 경고/오류 사전 제거.
- **UX/에러 처리 패턴**
  - 에러 발생 시 실시간 메시지 표시, 첫 에러 필드 자동 포커스, 버튼 비활성화 등 UX best practice를 일관되게 적용.

이러한 세부 패턴은 @tanstack/react-form의 Headless 구조와 Next.js/TypeScript 환경의 특성을 최대한 활용하여,
유지보수성과 확장성, 접근성, 코드 품질을 모두 만족하는 폼 구현을 가능하게 함.

## 참고 자료 (References)

- [TanStack Form 공식 문서](https://tanstack.com/form)
- [TanStack Form React 예제](https://github.com/TanStack/form/tree/main/examples/react)
- [React Hook Form vs TanStack Form 비교](https://tanstack.com/form/latest/docs/comparison)
- [Next.js 공식 폼/서버 액션 가이드](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
