'use client';

import {
  type CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import type { Company, GhgEmission } from '@/types';

interface CompanyListProps {
  companies: Company[];
}

const PAGE_SIZE = 10;

export function CompanyList({ companies }: CompanyListProps) {
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Calculate total emissions for a company
  const getTotalEmissions = useCallback((emissions: GhgEmission[]) => {
    return emissions.reduce((sum, e) => sum + e.emissions, 0);
  }, []);

  // Format number with thousands separator
  const formatNumber = useCallback((num: number) => {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 2,
    }).format(num);
  }, []);

  // Group emissions by yearMonth
  const groupByYearMonth = useCallback((emissions: GhgEmission[]) => {
    const grouped = new Map<string, { sources: Map<string, number>; total: number }>();

    for (const e of emissions) {
      if (!grouped.has(e.yearMonth)) {
        grouped.set(e.yearMonth, { sources: new Map(), total: 0 });
      }
      const group = grouped.get(e.yearMonth);
      if (group) {
        group.sources.set(e.source, (group.sources.get(e.source) || 0) + e.emissions);
        group.total += e.emissions;
      }
    }

    return Array.from(grouped.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([yearMonth, data]) => ({ yearMonth, ...data }));
  }, []);

  const toggleExpanded = useCallback((companyId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  }, []);

  const columns: ColumnDef<Company>[] = useMemo(
    () => [
      {
        id: 'expander',
        header: '',
        cell: (info: CellContext<Company, unknown>) => {
          const company = info.row.original;
          const isExpanded = expandedRows.has(company.id);
          return (
            <button
              type="button"
              onClick={() => toggleExpanded(company.id)}
              className="text-lg cursor-pointer hover:text-blue-600 focus:outline-none focus:ring"
              aria-label={isExpanded ? '접기' : '펼치기'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          );
        },
      },
      {
        accessorKey: 'name',
        header: '회사명',
        cell: (info: CellContext<Company, unknown>) => (
          <div className="font-medium">{String(info.getValue())}</div>
        ),
      },
      {
        accessorKey: 'country',
        header: '국가',
        cell: (info: CellContext<Company, unknown>) => String(info.getValue()),
      },
      {
        id: 'totalEmissions',
        header: '총 배출량 (tCO₂e)',
        cell: (info: CellContext<Company, unknown>) => {
          const total = getTotalEmissions(info.row.original.emissions);
          return <div className="text-right font-mono">{formatNumber(total)}</div>;
        },
      },
      {
        id: 'emissionYears',
        header: '기록 연도',
        cell: (info: CellContext<Company, unknown>) => {
          const years = Array.from(
            new Set(info.row.original.emissions.map((e) => e.yearMonth.substring(0, 4)))
          ).sort();
          return <div className="text-sm text-gray-500">{years.join(', ')}</div>;
        },
      },
    ],
    [expandedRows, getTotalEmissions, formatNumber, toggleExpanded]
  );

  const pageCount = Math.ceil(companies.length / PAGE_SIZE);
  const pagedCompanies = useMemo(
    () => companies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [companies, page]
  );

  const table = useReactTable({
    data: pagedCompanies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: { pagination: { pageIndex: page, pageSize: PAGE_SIZE } },
  });

  return (
    <section className="w-full" aria-live="polite">
      <div className="mb-4">
        <span className="text-sm text-gray-600">총 {companies.length}개 회사</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white rounded shadow">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-2 py-2 text-left font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-gray-500 text-center py-6">
                  회사가 없습니다.
                </td>
              </tr>
            ) : (
              <>
                {table.getRowModel().rows.map((row) => {
                  const company = row.original;
                  const isExpanded = expandedRows.has(company.id);
                  return (
                    <>
                      <tr key={row.id} className="border-b hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-2 py-1">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {isExpanded && (
                        <tr key={`${row.id}-expanded`}>
                          <td colSpan={columns.length} className="px-4 py-4 bg-gray-50">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm">배출량 상세 내역</h4>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-xs border">
                                  <thead className="bg-gray-200">
                                    <tr>
                                      <th className="px-2 py-1 text-left font-medium border-r">
                                        연월
                                      </th>
                                      <th className="px-2 py-1 text-left font-medium border-r">
                                        배출원
                                      </th>
                                      <th className="px-2 py-1 text-right font-medium">
                                        배출량 (tCO₂e)
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {groupByYearMonth(company.emissions).map((group) => (
                                      <>
                                        {Array.from(group.sources.entries()).map(
                                          ([source, amount], idx) => (
                                            <tr
                                              key={`${group.yearMonth}-${source}`}
                                              className="border-b hover:bg-gray-100"
                                            >
                                              {idx === 0 && (
                                                <td
                                                  className="px-2 py-1 font-medium border-r bg-gray-50"
                                                  rowSpan={group.sources.size}
                                                >
                                                  {group.yearMonth}
                                                </td>
                                              )}
                                              <td className="px-2 py-1 text-gray-600 border-r">
                                                {source}
                                              </td>
                                              <td className="px-2 py-1 text-right font-mono">
                                                {formatNumber(amount)}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                        <tr className="bg-blue-50 font-semibold">
                                          <td className="px-2 py-1 text-right border-r" colSpan={2}>
                                            {group.yearMonth} 소계
                                          </td>
                                          <td className="px-2 py-1 text-right font-mono">
                                            {formatNumber(group.total)}
                                          </td>
                                        </tr>
                                      </>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          type="button"
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="이전 페이지"
        >
          이전
        </button>
        <span className="text-sm">
          {page + 1} / {pageCount || 1}
        </span>
        <button
          type="button"
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page >= pageCount - 1}
          aria-label="다음 페이지"
        >
          다음
        </button>
      </div>
    </section>
  );
}
