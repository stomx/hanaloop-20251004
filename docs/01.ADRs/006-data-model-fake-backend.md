# ADR-006: 데이터 모델 및 Fake Backend 구현

## 상태 (Status)

승인됨 (Accepted)

## 맥락 (Context)

탄소 배출 대시보드의 데이터 레이어를 구현해야 합니다. 실제 백엔드 없이 프론트엔드
개발을 진행하기 위해 타입 정의, 시드 데이터, 그리고 네트워크 I/O를 시뮬레이션하는
가짜 API가 필요합니다.

### 프로젝트 요구사항

**기능 요구사항:**

- 국가(Country), 회사(Company), 배출량(GhgEmission), 포스트(Post) 데이터 관리
- 회사별 월별 배출량 조회 및 집계
- 포스트 CRUD 기능

**기술 요구사항:**

- TypeScript strict mode
- 네트워크 지연 시뮬레이션 (200-800ms)
- 실패 시뮬레이션 (10-20%)
- 로딩 상태 및 에러 처리 테스트 가능

**평가 기준:**

- 소프트웨어 엔지니어링 (20%): 모듈성, 성능, 확장성
- UI 엔지니어링 (20%): 로딩/에러 처리, 상태 분리

### 설계 고려사항

**데이터 모델:**

1. 단순하고 명확한 타입 정의
2. 관계형 데이터 구조 (Country -> Company -> Emissions/Posts)
3. 집계 및 필터링 용이성

**API 설계:**

1. 읽기 작업: 즉시 응답 (지연만 적용)
2. 쓰기 작업: 지연 + 실패 시뮬레이션
3. RESTful 패턴 준수

**상태 관리:**

1. 인메모리 저장 (세션 동안 유지)
2. 낙관적 업데이트 지원
3. 롤백 가능한 구조

## 결정 (Decision)

### 1. 데이터 모델 정의

#### TypeScript 타입 시스템

**types/index.ts:**

```typescript
// Country - 국가 정보
export interface Country {
  code: string;  // ISO 2-letter code (예: "US", "KR")
  name: string;  // 국가명
}

// GhgEmission - 온실가스 배출량
export interface GhgEmission {
  yearMonth: string;  // "YYYY-MM" 형식
  source: string;     // 배출원 (gasoline, diesel, lpg, natural gas)
  emissions: number;  // CO2 환산 톤
}

// Company - 회사 정보
export interface Company {
  id: string;
  name: string;
  country: string;  // Country.code 참조
  emissions: GhgEmission[];
}

// Post - 포스트/보고서
export interface Post {
  id: string;
  title: string;
  resourceUid: string;  // Company.id 참조
  dateTime: string;     // "YYYY-MM" 형식
  content: string;
}

// 유틸리티 타입
export type CreatePostInput = Omit<Post, 'id'>;
export type UpdatePostInput = Partial<CreatePostInput> & { id: string };
```

**선택 근거:**

- **명확성**: 각 필드의 목적과 형식이 명확
- **타입 안전성**: strict mode에서 완전한 타입 체킹
- **확장성**: 향후 필드 추가 용이
- **관계 표현**: string 참조로 단순하면서도 명확한 관계

### 2. 시드 데이터 구조

#### 파일 구조

```text
src/lib/seed-data/
├── countries.ts    # 5개 국가
├── companies.ts    # 10개 회사 + 배출량 데이터
└── posts.ts        # 15개 포스트
```

**데이터 특징:**

- **다양성**: 여러 국가, 회사, 배출원
- **시계열**: 2024-01 ~ 2024-10 (10개월)
- **현실성**: 실제 배출량 패턴 반영 (증가/감소 추세)
- **충분한 양**: 차트와 테이블 테스트에 적합

#### countries.ts 예시

```typescript
import type { Country } from '@/types';

export const countries: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'DE', name: 'Germany' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
];
```

#### companies.ts 설계

```typescript
import type { Company } from '@/types';

export const companies: Company[] = [
  {
    id: 'c1',
    name: 'Acme Corp',
    country: 'US',
    emissions: [
      { yearMonth: '2024-01', source: 'gasoline', emissions: 120.5 },
      { yearMonth: '2024-01', source: 'diesel', emissions: 50.2 },
      // ... 10개월 데이터
    ]
  },
  // ... 10개 회사
];
```

**배출원 타입:**

- `gasoline`: 휘발유
- `diesel`: 경유
- `lpg`: LPG
- `natural_gas`: 천연가스

### 3. Fake Backend API 구현

#### API 모듈 설계

**lib/api.ts 주요 기능:**

```typescript
// 유틸리티 함수
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600; // 200-800ms
const maybeFail = () => Math.random() < 0.15; // 15% 실패율

// 에러 클래스
export class ApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// 인메모리 저장소
let _countries: Country[] = [...seedCountries];
let _companies: Company[] = [...seedCompanies];
let _posts: Post[] = [...seedPosts];
```

#### 읽기 API

```typescript
// 국가 목록 조회
export async function fetchCountries(): Promise<Country[]> {
  await delay(jitter());
  return [..._countries];
}

// 회사 목록 조회
export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  return [..._companies];
}

// 특정 회사 조회
export async function fetchCompanyById(id: string): Promise<Company | null> {
  await delay(jitter());
  return _companies.find(c => c.id === id) || null;
}

// 포스트 목록 조회
export async function fetchPosts(filters?: {
  companyId?: string;
  yearMonth?: string;
}): Promise<Post[]> {
  await delay(jitter());
  let result = [..._posts];
  
  if (filters?.companyId) {
    result = result.filter(p => p.resourceUid === filters.companyId);
  }
  if (filters?.yearMonth) {
    result = result.filter(p => p.dateTime === filters.yearMonth);
  }
  
  return result;
}

// 특정 포스트 조회
export async function fetchPostById(id: string): Promise<Post | null> {
  await delay(jitter());
  return _posts.find(p => p.id === id) || null;
}
```

#### 쓰기 API

```typescript
// 포스트 생성
export async function createPost(input: CreatePostInput): Promise<Post> {
  await delay(jitter());
  
  if (maybeFail()) {
    throw new ApiError('Failed to create post. Please try again.', 'CREATE_FAILED');
  }
  
  const newPost: Post = {
    id: `p${Date.now()}`,
    ...input,
  };
  
  _posts = [..._posts, newPost];
  return newPost;
}

// 포스트 수정
export async function updatePost(input: UpdatePostInput): Promise<Post> {
  await delay(jitter());
  
  if (maybeFail()) {
    throw new ApiError('Failed to update post. Please try again.', 'UPDATE_FAILED');
  }
  
  const index = _posts.findIndex(p => p.id === input.id);
  if (index === -1) {
    throw new ApiError('Post not found', 'NOT_FOUND');
  }
  
  const updated: Post = {
    ..._posts[index],
    ...input,
  };
  
  _posts = [..._posts.slice(0, index), updated, ..._posts.slice(index + 1)];
  return updated;
}

// 포스트 삭제
export async function deletePost(id: string): Promise<void> {
  await delay(jitter());
  
  if (maybeFail()) {
    throw new ApiError('Failed to delete post. Please try again.', 'DELETE_FAILED');
  }
  
  const index = _posts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new ApiError('Post not found', 'NOT_FOUND');
  }
  
  _posts = _posts.filter(p => p.id !== id);
}
```

### 4. 유틸리티 함수

#### lib/data-utils.ts

```typescript
import type { Company, GhgEmission } from '@/types';

// 회사별 월별 총 배출량 계산
export function getTotalEmissionsByMonth(
  company: Company
): Record<string, number> {
  return company.emissions.reduce((acc, emission) => {
    acc[emission.yearMonth] = (acc[emission.yearMonth] || 0) + emission.emissions;
    return acc;
  }, {} as Record<string, number>);
}

// 회사별 배출원별 총 배출량 계산
export function getEmissionsBySource(
  company: Company
): Record<string, number> {
  return company.emissions.reduce((acc, emission) => {
    acc[emission.source] = (acc[emission.source] || 0) + emission.emissions;
    return acc;
  }, {} as Record<string, number>);
}

// 전체 회사 총 배출량 계산
export function getTotalEmissions(companies: Company[]): number {
  return companies.reduce((total, company) => {
    const companyTotal = company.emissions.reduce(
      (sum, emission) => sum + emission.emissions,
      0
    );
    return total + companyTotal;
  }, 0);
}

// 월별 전체 배출량 (모든 회사 합산)
export function getMonthlyTotalEmissions(
  companies: Company[]
): Record<string, number> {
  const monthlyData: Record<string, number> = {};
  
  companies.forEach(company => {
    company.emissions.forEach(emission => {
      monthlyData[emission.yearMonth] = 
        (monthlyData[emission.yearMonth] || 0) + emission.emissions;
    });
  });
  
  return monthlyData;
}

// 날짜 형식 유틸리티
export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${year}년 ${parseInt(month)}월`;
}

// 배출원 한글명
export const sourceLabels: Record<string, string> = {
  gasoline: '휘발유',
  diesel: '경유',
  lpg: 'LPG',
  natural_gas: '천연가스',
};
```

## 결과 (Consequences)

### 긍정적 결과

#### 개발 생산성

- ✅ **독립적 개발**: 백엔드 없이 프론트엔드 완성 가능
- ✅ **즉시 테스트**: 데이터 변경 즉시 반영
- ✅ **오프라인 작업**: 네트워크 불필요

#### 품질 보장

- ✅ **타입 안전성**: TypeScript strict mode 완전 활용
- ✅ **에러 처리**: 실패 시나리오 현실적 테스트
- ✅ **로딩 상태**: 네트워크 지연 정확히 시뮬레이션

#### 확장성

- ✅ **모듈 구조**: 각 엔티티별 파일 분리
- ✅ **유틸리티**: 재사용 가능한 데이터 처리 함수
- ✅ **마이그레이션**: 실제 API로 전환 용이

#### 평가 기준 충족

- ✅ **소프트웨어 엔지니어링**: 모듈성, 타입 안전성
- ✅ **UI 엔지니어링**: 로딩/에러 처리 가능
- ✅ **코드 품질**: 명확한 구조, 주석

### 잠재적 이슈

#### 데이터 지속성

- ⚠️ **새로고침 시 초기화**: 인메모리 저장소 특성
- ⚠️ **브라우저 간 독립**: 탭마다 다른 상태

#### 성능

- ⚠️ **대량 데이터**: 배열 복사 오버헤드
- ⚠️ **필터링**: 클라이언트 사이드 처리

#### 실제 API와 차이

- ⚠️ **페이지네이션 없음**: 전체 데이터 반환
- ⚠️ **정렬 기능 제한**: 클라이언트 사이드 처리

### 완화 전략

#### localStorage 통합 (선택사항)

```typescript
// 데이터 영속성이 필요한 경우
function saveToLocalStorage() {
  localStorage.setItem('posts', JSON.stringify(_posts));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('posts');
  if (saved) _posts = JSON.parse(saved);
}
```

#### 성능 최적화

```typescript
// 필요시 메모이제이션
const companiesCache = new Map<string, Company>();

export async function fetchCompanyByIdCached(id: string) {
  if (companiesCache.has(id)) {
    return companiesCache.get(id)!;
  }
  const company = await fetchCompanyById(id);
  if (company) companiesCache.set(id, company);
  return company;
}
```

#### 실제 API 전환 준비

```typescript
// 환경 변수로 fake/real API 전환
const USE_FAKE_API = process.env.NEXT_PUBLIC_USE_FAKE_API === 'true';

export const api = USE_FAKE_API ? fakeApi : realApi;
```

## 실제 API로 마이그레이션 시

### 1. API 클라이언트 생성

```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}
```

### 2. 동일한 인터페이스 유지

```typescript
// lib/api-real.ts
export async function fetchCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>('/api/companies');
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  return apiRequest<Post>('/api/posts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
```

### 3. 점진적 전환

```typescript
// lib/api/index.ts
import * as fakeApi from './fake';
import * as realApi from './real';

const USE_FAKE_API = process.env.NEXT_PUBLIC_USE_FAKE_API !== 'false';

export const {
  fetchCountries,
  fetchCompanies,
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} = USE_FAKE_API ? fakeApi : realApi;
```

## 관련 자료 (References)

- [프로젝트 데이터 모델 요구사항](../00.requirements/06.data-model.md)
- [Fake Backend 구현 사양](../00.requirements/07.fake-backend.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
