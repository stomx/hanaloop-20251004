import { CompanyList } from '@/components/companies';
import { fetchCompanies } from '@/lib/api';

export default async function CompaniesPage() {
  const companies = await fetchCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">회사 관리</h1>
        <p className="text-muted-foreground mt-2">등록된 회사 목록과 배출량 데이터를 확인하세요.</p>
      </div>

      <CompanyList companies={companies} />
    </div>
  );
}
