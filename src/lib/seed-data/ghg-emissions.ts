import type { GhgEmission } from '@/types';

// 배출원별 기본 배출량 (tons CO2e per month)
const baseEmissions = {
  gasoline: 12.5,
  diesel: 18.3,
  lpg: 8.7,
  natural_gas: 15.2,
};

// 월별 변동성을 위한 계수
const monthlyVariation = [
  1.2, // 1월 (겨울철 높음)
  1.1, // 2월
  1.0, // 3월
  0.9, // 4월
  0.8, // 5월 (봄철 낮음)
  0.7, // 6월
  0.8, // 7월 (여름철 에어컨)
  0.9, // 8월
  1.0, // 9월
  1.1, // 10월
  1.2, // 11월 (겨울철 높음)
  1.3, // 12월
];

// 2023년과 2024년 배출량 데이터 생성
function generateEmissionsData(): GhgEmission[] {
  const emissions: GhgEmission[] = [];
  const sources = Object.keys(baseEmissions) as Array<keyof typeof baseEmissions>;

  // 2023년 데이터
  for (let month = 1; month <= 12; month++) {
    sources.forEach((source) => {
      const baseAmount = baseEmissions[source];
      const seasonalFactor = monthlyVariation[month - 1];
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 ~ 1.2 사이의 랜덤 변동

      emissions.push({
        yearMonth: `2023-${month.toString().padStart(2, '0')}`,
        source,
        emissions: Number((baseAmount * seasonalFactor * randomFactor).toFixed(1)),
      });
    });
  }

  // 2024년 데이터 (1-10월)
  for (let month = 1; month <= 10; month++) {
    sources.forEach((source) => {
      const baseAmount = baseEmissions[source];
      const seasonalFactor = monthlyVariation[month - 1];
      const trendFactor = 1.05; // 연간 5% 증가 추세
      const randomFactor = 0.8 + Math.random() * 0.4;

      emissions.push({
        yearMonth: `2024-${month.toString().padStart(2, '0')}`,
        source,
        emissions: Number((baseAmount * seasonalFactor * trendFactor * randomFactor).toFixed(1)),
      });
    });
  }

  return emissions.sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

export const ghgEmissions: GhgEmission[] = generateEmissionsData();
