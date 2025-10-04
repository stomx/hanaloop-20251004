// 내비게이션 메뉴 구조를 별도 파일로 분리
import { BarChart3, Building2, FileText, Home } from 'lucide-react';

export const navigation = [
  {
    name: '대시보드',
    href: '/',
    icon: Home,
    description: '기업의 탄소 배출량을 실시간으로 모니터링하고 관리합니다',
  },
  {
    name: '배출 현황',
    href: '/emissions',
    icon: BarChart3,
    description: '탄소 배출 데이터를 상세히 분석하고 트렌드를 확인합니다',
  },
  {
    name: '포스트',
    href: '/posts',
    icon: FileText,
    description: '탄소 관리 관련 최신 소식과 정보를 확인합니다',
  },
  {
    name: '회사 목록',
    href: '/companies',
    icon: Building2,
    description: '등록된 회사들의 배출 정보를 조회하고 관리합니다',
  },
];
