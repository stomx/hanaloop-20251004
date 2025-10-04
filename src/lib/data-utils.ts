import type { Company } from '@/types';

/**
 * 회사별 월별 총 배출량 계산
 */
export function getTotalEmissionsByMonth(company: Company): Record<string, number> {
  return company.emissions.reduce(
    (acc, emission) => {
      acc[emission.yearMonth] = (acc[emission.yearMonth] || 0) + emission.emissions;
      return acc;
    },
    {} as Record<string, number>
  );
}

/**
 * 회사별 배출원별 총 배출량 계산
 */
export function getEmissionsBySource(company: Company): Record<string, number> {
  return company.emissions.reduce(
    (acc, emission) => {
      acc[emission.source] = (acc[emission.source] || 0) + emission.emissions;
      return acc;
    },
    {} as Record<string, number>
  );
}

/**
 * 전체 회사 총 배출량 계산
 */
export function getTotalEmissions(companies: Company[]): number {
  return companies.reduce((total, company) => {
    const companyTotal = company.emissions.reduce((sum, emission) => sum + emission.emissions, 0);
    return total + companyTotal;
  }, 0);
}

/**
 * 월별 전체 배출량 (모든 회사 합산)
 */
export function getMonthlyTotalEmissions(companies: Company[]): Record<string, number> {
  const monthlyData: Record<string, number> = {};

  companies.forEach((company) => {
    company.emissions.forEach((emission) => {
      monthlyData[emission.yearMonth] = (monthlyData[emission.yearMonth] || 0) + emission.emissions;
    });
  });

  return monthlyData;
}

/**
 * 월별 데이터를 정렬된 배열로 변환
 */
export function sortMonthlyData(monthlyData: Record<string, number>): Array<{
  yearMonth: string;
  emissions: number;
}> {
  return Object.entries(monthlyData)
    .map(([yearMonth, emissions]) => ({ yearMonth, emissions }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

/**
 * 날짜 형식 유틸리티
 */
export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${year}년 ${parseInt(month, 10)}월`;
}

/**
 * 날짜를 짧은 형식으로 변환 (차트용)
 */
export function formatYearMonthShort(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${year.slice(2)}.${month}`;
}

/**
 * 배출원 한글명 매핑
 */
export const sourceLabels: Record<string, string> = {
  gasoline: '휘발유',
  diesel: '경유',
  lpg: 'LPG',
  natural_gas: '천연가스',
};

/**
 * 배출원 영문명을 한글로 변환
 */
export function getSourceLabel(source: string): string {
  return sourceLabels[source] || source;
}

/**
 * 숫자를 천 단위 구분자로 포맷
 */
export function formatNumber(num: number, decimals = 1): string {
  return num.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 회사별 총 배출량 계산
 */
export function getCompanyTotalEmissions(company: Company): number {
  return company.emissions.reduce((sum, emission) => sum + emission.emissions, 0);
}

/**
 * 회사 목록을 총 배출량 기준으로 정렬
 */
export function sortCompaniesByEmissions(
  companies: Company[],
  order: 'asc' | 'desc' = 'desc'
): Company[] {
  return [...companies].sort((a, b) => {
    const totalA = getCompanyTotalEmissions(a);
    const totalB = getCompanyTotalEmissions(b);
    return order === 'desc' ? totalB - totalA : totalA - totalB;
  });
}

/**
 * 국가별 회사 그룹화
 */
export function groupCompaniesByCountry(companies: Company[]): Record<string, Company[]> {
  return companies.reduce(
    (acc, company) => {
      if (!acc[company.country]) {
        acc[company.country] = [];
      }
      acc[company.country].push(company);
      return acc;
    },
    {} as Record<string, Company[]>
  );
}

/**
 * 최신 월 데이터 가져오기
 */
export function getLatestMonth(companies: Company[]): string | null {
  const months = new Set<string>();
  companies.forEach((company) => {
    company.emissions.forEach((emission) => {
      months.add(emission.yearMonth);
    });
  });

  if (months.size === 0) return null;

  return Array.from(months).sort((a, b) => b.localeCompare(a))[0];
}

/**
 * 특정 월의 전체 배출량 계산
 */
export function getEmissionsForMonth(companies: Company[], yearMonth: string): number {
  let total = 0;
  companies.forEach((company) => {
    company.emissions.forEach((emission) => {
      if (emission.yearMonth === yearMonth) {
        total += emission.emissions;
      }
    });
  });
  return total;
}
