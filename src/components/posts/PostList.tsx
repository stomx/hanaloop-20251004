'use client';
import type { CellContext } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import PostFormModal from '@/components/posts/PostFormModal';
import { deletePost, fetchPosts } from '@/lib/api';
import { companies as seedCompanies } from '@/lib/seed-data/companies';
import type { Company, Post } from '@/types';

const PAGE_SIZE = 10;

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const loadPosts = useMemo(
    () => () => {
      setLoading(true);
      fetchPosts()
        .then((data) => {
          setPosts(Array.isArray(data) ? data : []);
          setError(null);
        })
        .catch((e) => setError(e?.message || '알 수 없는 에러'))
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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
        cell: (info: CellContext<Post, unknown>) => {
          const post = info.row.original;
          const title = String(info.getValue() || '제목 없음');
          return (
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-600 hover:underline focus:outline-none focus:ring"
            >
              {title}
            </Link>
          );
        },
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
        cell: (info: CellContext<Post, unknown>) => {
          const post = info.row.original;

          const handleEdit = () => {
            setEditingPost(post);
            setModalOpen(true);
          };

          const handleDelete = async () => {
            if (!window.confirm(`'${post.title}' 포스트를 삭제하시겠습니까?`)) {
              return;
            }
            try {
              await deletePost(post.id);
              loadPosts();
            } catch (e) {
              const errorMsg =
                e && typeof e === 'object' && 'message' in e
                  ? String((e as { message?: unknown }).message)
                  : '삭제 중 오류 발생';
              alert(errorMsg);
            }
          };

          return (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleEdit}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 focus:outline-none focus:ring"
                aria-label={`${post.title} 편집`}
              >
                편집
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 focus:outline-none focus:ring"
                aria-label={`${post.title} 삭제`}
              >
                삭제
              </button>
            </div>
          );
        },
      },
    ],
    [companyMap, loadPosts]
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
      <div className="mb-4 flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
        <span className="text-xs text-gray-400">* 검색/필터는 추가 구현 필요</span>
        <button
          type="button"
          onClick={() => {
            setEditingPost(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
        >
          새 포스트 작성
        </button>
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
        </>
      )}
      <PostFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        post={editingPost}
        onSuccess={() => {
          loadPosts();
          setEditingPost(null);
        }}
      />
    </section>
  );
}
