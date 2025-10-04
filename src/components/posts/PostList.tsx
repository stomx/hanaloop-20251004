'use client';
import type { CellContext } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import PostFormModal from '@/components/posts/PostFormModal';
import { toast } from '@/components/ui/toast';
import { deletePost, fetchPosts } from '@/lib/api';
import { companies as seedCompanies } from '@/lib/seed-data/companies';
import { posts as seedPosts } from '@/lib/seed-data/posts';
import type { Company, Post } from '@/types';
import { Button } from '../ui/button';

const PAGE_SIZE = 10;

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const companyFilterId = useId();
  const monthFilterId = useId();

  const loadPosts = useCallback(
    (filters?: { companyId?: string; yearMonth?: string }, silent = false) => {
      if (!silent) {
        setLoading(true);
      }
      fetchPosts(filters)
        .then((data) => {
          setPosts(Array.isArray(data) ? data : []);
          setError(null);
        })
        .catch((e) => setError((e && (e as { message?: string }).message) || '알 수 없는 에러'))
        .finally(() => {
          if (!silent) {
            setLoading(false);
          }
          setIsInitialLoad(false);
        });
    },
    []
  );

  useEffect(() => {
    loadPosts(
      {
        companyId: companyFilter || undefined,
        yearMonth: monthFilter || undefined,
      },
      !isInitialLoad
    );
  }, [loadPosts, companyFilter, monthFilter, isInitialLoad]);

  const companyMap = useMemo(() => {
    const map: Record<string, string> = {};
    seedCompanies.forEach((c: Company) => {
      map[c.id] = c.name;
    });
    return map;
  }, []);

  const handleEdit = useCallback((post: Post) => {
    setEditingPost(post);
    setModalOpen(true);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: '제목',
        size: 32,
        cell: (info: CellContext<Post, unknown>) => {
          const post = info.row.original;
          const title = String(info.getValue() || '제목 없음');
          return (
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:underline focus-visible:font-semibold"
            >
              {title}
            </Link>
          );
        },
      },
      {
        accessorKey: 'company',
        header: '회사',
        size: 16,
        cell: (info: CellContext<Post, unknown>) =>
          companyMap[info.row.original.resourceUid] ||
          info.row.original.resourceUid || <span className="text-gray-400">회사 없음</span>,
      },
      {
        accessorKey: 'dateTime',
        header: '작성일',
        size: 13,
        cell: (info: CellContext<Post, unknown>) => info.getValue() || '-',
      },
      {
        accessorKey: 'content',
        header: '내용',
        size: 26,
        cell: (info: CellContext<Post, unknown>) => {
          const content = info.getValue();
          if (!content) {
            return <span className="text-gray-400">내용 없음</span>;
          }
          const text = String(content);
          return (
            <span className="block truncate" title={text}>
              {text}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '관리',
        size: 13,
        cell: (info: CellContext<Post, unknown>) => {
          const post = info.row.original;

          const handleDelete = async () => {
            if (!window.confirm(`'${post.title}' 포스트를 삭제하시겠습니까?`)) {
              return;
            }

            // 낙관적 업데이트: 즉시 제거 후 실패 시 롤백
            const snapshot = posts;
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
            try {
              await deletePost(post.id);
              toast.success({ title: '삭제되었습니다.' });
              // 현재 필터 유지한 채 서버 상태와 동기화 (silent 모드)
              loadPosts(
                {
                  companyId: companyFilter || undefined,
                  yearMonth: monthFilter || undefined,
                },
                true
              );
            } catch (e) {
              setPosts(snapshot);
              const errorMsg =
                e && typeof e === 'object' && 'message' in e
                  ? String((e as { message?: unknown }).message)
                  : '삭제 중 오류 발생';
              toast.error({ title: '삭제 실패', description: errorMsg });
            }
          };

          return (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 transition-all"
                aria-label={`${post.title} 삭제`}
              >
                삭제
              </Button>
            </div>
          );
        },
      },
    ],
    [companyMap, loadPosts, posts, companyFilter, monthFilter]
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

  return (
    <section className="w-full" aria-live="polite">
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm text-gray-600" htmlFor={companyFilterId}>
            회사
          </label>
          <select
            className="border rounded px-2 py-1 text-sm transition-all duration-200"
            aria-label="회사 필터"
            id={companyFilterId}
            value={companyFilter}
            onChange={(e) => {
              setPage(0);
              setCompanyFilter(e.target.value);
            }}
          >
            <option value="">전체</option>
            {seedCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="text-sm text-gray-600 ml-3" htmlFor={monthFilterId}>
            연월
          </label>
          <select
            className="border rounded px-2 py-1 text-sm transition-all duration-200"
            aria-label="연월 필터"
            id={monthFilterId}
            value={monthFilter}
            onChange={(e) => {
              setPage(0);
              setMonthFilter(e.target.value);
            }}
          >
            <option value="">전체</option>
            {Array.from(new Set(seedPosts.map((p) => p.dateTime)))
              .sort((a, b) => b.localeCompare(a))
              .map((ym) => (
                <option key={ym} value={ym}>
                  {ym}
                </option>
              ))}
          </select>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingPost(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 transition-all"
        >
          새 포스트 작성
        </Button>
      </div>
      {loading && <div className="text-center py-4">로딩 중...</div>}
      {!loading && error && (
        <div className="text-red-500" role="alert">
          에러: {error}
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table
              className="min-w-full w-full border text-sm bg-white rounded shadow"
              style={{ tableLayout: 'fixed' }}
            >
              <thead className="bg-gray-100 h-12 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-2 py-2 text-left font-semibold overflow-hidden"
                        style={{ width: `${header.getSize()}%` }}
                      >
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
                    <tr
                      key={row.id}
                      className=" even:bg-gray-100 hover:bg-primary/5 hover:cursor-pointer"
                      onClick={() => handleEdit(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-2 py-1 overflow-hidden"
                          style={{ width: `${cell.column.getSize()}%` }}
                        >
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
            <Button
              type="button"
              className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="이전 페이지"
            >
              이전
            </Button>
            <span className="text-sm">
              {page + 1} / {pageCount || 1}
            </span>
            <Button
              type="button"
              className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              aria-label="다음 페이지"
            >
              다음
            </Button>
          </div>
        </>
      )}
      <PostFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        post={editingPost}
        onSuccess={() => {
          toast.success({ title: '저장되었습니다.' });
          loadPosts(
            {
              companyId: companyFilter || undefined,
              yearMonth: monthFilter || undefined,
            },
            true
          );
          setEditingPost(null);
        }}
      />
    </section>
  );
}
