'use client';
import type { CellContext } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { fetchPosts } from '@/lib/api';
import { companies as seedCompanies } from '@/lib/seed-data/companies';
// import PostTableRow from '@/components/posts/PostTableRow';
import type { Company, Post } from '@/types';

const PAGE_SIZE = 10;

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || '알 수 없는 에러'));
  }, []);

  const companyMap = useMemo(() => {
    const map: Record<string, string> = {};
    seedCompanies.forEach((c: Company) => {
      map[c.id] = c.name;
    });
    return map;
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: '제목',
        cell: (info: CellContext<Post, unknown>) =>
          info.getValue() || <span className="text-gray-400">제목 없음</span>,
      },
      {
        accessorKey: 'company',
        header: '회사',
        cell: (info: CellContext<Post, unknown>) =>
          companyMap[info.row.original.resourceUid] ||
          info.row.original.resourceUid || <span className="text-gray-400">회사 없음</span>,
      },
      {
        accessorKey: 'dateTime',
        header: '작성일',
        cell: (info: CellContext<Post, unknown>) => info.getValue() || '-',
      },
      {
        accessorKey: 'content',
        header: '내용',
        cell: (info: CellContext<Post, unknown>) =>
          info.getValue() ? (
            String(info.getValue()).slice(0, 40)
          ) : (
            <span className="text-gray-400">내용 없음</span>
          ),
      },
      {
        id: 'actions',
        header: '관리',
        cell: () => (
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 focus:outline-none focus:ring"
              aria-label="편집"
            >
              편집
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 focus:outline-none focus:ring"
              aria-label="삭제"
            >
              삭제
            </button>
          </div>
        ),
      },
    ],
    [companyMap]
  );

  const pageCount = Math.ceil(posts.length / PAGE_SIZE);
  const pagedPosts = useMemo(
    () => posts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [posts, page]
  );

  const table = useReactTable({
    data: pagedPosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: { pagination: { pageIndex: page, pageSize: PAGE_SIZE } },
  });

  if (error) {
    return (
      <div className="text-red-500" role="alert">
        에러: {error}
      </div>
    );
  }

  return (
    <section className="w-full" aria-live="polite">
      <div className="mb-4 flex flex-col md:flex-row gap-2 items-start md:items-center">
        <span className="text-xs text-gray-400">* 검색/필터는 추가 구현 필요</span>
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
                  포스트가 없습니다.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
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
          {page + 1} / {pageCount}
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
