import type {
  Company,
  Country,
  CreatePostInput,
  GhgEmission,
  Post,
  PostFilters,
  UpdatePostInput,
} from '@/types';
import { companies as seedCompanies } from './seed-data/companies';
import { countries as seedCountries } from './seed-data/countries';
import { ghgEmissions as seedGhgEmissions } from './seed-data/ghg-emissions';
import { posts as seedPosts } from './seed-data/posts';

// 유틸리티 함수
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600; // 200-800ms
const maybeFail = () => Math.random() < 0.15; // 15% 실패율

// 커스텀 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 인메모리 저장소 (세션 동안 유지)
let _countries: Country[] = [...seedCountries];
let _companies: Company[] = [...seedCompanies];
let _posts: Post[] = [...seedPosts];
const _ghgEmissions: GhgEmission[] = [...seedGhgEmissions];

// === 읽기 API ===

/**
 * 국가 목록 조회
 */
export async function fetchCountries(): Promise<Country[]> {
  await delay(jitter());
  return [..._countries];
}

/**
 * 회사 목록 조회
 */
export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  return [..._companies];
}

/**
 * GHG 배출량 데이터 조회
 */
export async function fetchGhgEmissions(): Promise<GhgEmission[]> {
  await delay(jitter());
  return [..._ghgEmissions];
}

/**
 * 특정 회사 조회
 */
export async function fetchCompanyById(id: string): Promise<Company | null> {
  await delay(jitter());
  const company = _companies.find((c) => c.id === id);
  return company ? { ...company } : null;
}

/**
 * 포스트 목록 조회 (필터 지원)
 */
export async function fetchPosts(filters?: PostFilters): Promise<Post[]> {
  await delay(jitter());
  let result = [..._posts];

  if (filters?.companyId) {
    result = result.filter((p) => p.resourceUid === filters.companyId);
  }

  if (filters?.yearMonth) {
    result = result.filter((p) => p.dateTime === filters.yearMonth);
  }

  // 최신순 정렬
  result.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

  return result;
}

/**
 * 특정 포스트 조회
 */
export async function fetchPostById(id: string): Promise<Post | null> {
  await delay(jitter());
  const post = _posts.find((p) => p.id === id);
  return post ? { ...post } : null;
}

// === 쓰기 API ===

/**
 * 포스트 생성
 */
export async function createPost(input: CreatePostInput): Promise<Post> {
  await delay(jitter());

  // 실패 시뮬레이션
  if (maybeFail()) {
    throw new ApiError('Failed to create post. Please try again.', 'CREATE_FAILED');
  }

  // 입력 검증
  if (!input.title.trim()) {
    throw new ApiError('Title is required', 'VALIDATION_ERROR');
  }
  if (!input.content.trim()) {
    throw new ApiError('Content is required', 'VALIDATION_ERROR');
  }
  if (!input.resourceUid) {
    throw new ApiError('Company is required', 'VALIDATION_ERROR');
  }
  if (!input.dateTime) {
    throw new ApiError('Date is required', 'VALIDATION_ERROR');
  }

  // 회사 존재 확인
  const companyExists = _companies.some((c) => c.id === input.resourceUid);
  if (!companyExists) {
    throw new ApiError('Company not found', 'NOT_FOUND');
  }

  const newPost: Post = {
    id: `p${Date.now()}`,
    ...input,
  };

  _posts = [..._posts, newPost];
  return { ...newPost };
}

/**
 * 포스트 수정
 */
export async function updatePost(input: UpdatePostInput): Promise<Post> {
  await delay(jitter());

  // 실패 시뮬레이션
  if (maybeFail()) {
    throw new ApiError('Failed to update post. Please try again.', 'UPDATE_FAILED');
  }

  const index = _posts.findIndex((p) => p.id === input.id);
  if (index === -1) {
    throw new ApiError('Post not found', 'NOT_FOUND');
  }

  // 입력 검증
  if (input.title !== undefined && !input.title.trim()) {
    throw new ApiError('Title cannot be empty', 'VALIDATION_ERROR');
  }
  if (input.content !== undefined && !input.content.trim()) {
    throw new ApiError('Content cannot be empty', 'VALIDATION_ERROR');
  }

  // 회사 존재 확인 (변경 시)
  if (input.resourceUid) {
    const companyExists = _companies.some((c) => c.id === input.resourceUid);
    if (!companyExists) {
      throw new ApiError('Company not found', 'NOT_FOUND');
    }
  }

  const updated: Post = {
    ..._posts[index],
    ...input,
  };

  _posts = [..._posts.slice(0, index), updated, ..._posts.slice(index + 1)];
  return { ...updated };
}

/**
 * 포스트 삭제
 */
export async function deletePost(id: string): Promise<void> {
  await delay(jitter());

  // 실패 시뮬레이션
  if (maybeFail()) {
    throw new ApiError('Failed to delete post. Please try again.', 'DELETE_FAILED');
  }

  const index = _posts.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new ApiError('Post not found', 'NOT_FOUND');
  }

  _posts = _posts.filter((p) => p.id !== id);
}

// === 개발용 유틸리티 ===

/**
 * 데이터 초기화 (개발/테스트용)
 */
export function resetData(): void {
  _countries = [...seedCountries];
  _companies = [...seedCompanies];
  _posts = [...seedPosts];
}

/**
 * 현재 데이터 상태 조회 (디버깅용)
 */
export function getDataSnapshot() {
  return {
    countries: [..._countries],
    companies: [..._companies],
    posts: [..._posts],
  };
}
