// Country - 국가 정보
export interface Country {
  code: string; // ISO 2-letter code (예: "US", "KR")
  name: string; // 국가명
}

// GhgEmission - 온실가스 배출량
export interface GhgEmission {
  yearMonth: string; // "YYYY-MM" 형식
  source: string; // 배출원 (gasoline, diesel, lpg, natural_gas)
  emissions: number; // CO2 환산 톤
}

// Company - 회사 정보
export interface Company {
  id: string;
  name: string;
  country: string; // Country.code 참조
  emissions: GhgEmission[];
}

// Post - 포스트/보고서
export interface Post {
  id: string;
  title: string;
  resourceUid: string; // Company.id 참조
  dateTime: string; // "YYYY-MM" 형식
  content: string;
}

// 유틸리티 타입
export type CreatePostInput = Omit<Post, 'id'>;
export type UpdatePostInput = Partial<CreatePostInput> & { id: string };

// API 필터 타입
export interface PostFilters {
  companyId?: string;
  yearMonth?: string;
}
