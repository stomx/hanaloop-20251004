'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PostFormModal from '@/components/posts/PostFormModal';
import { deletePost } from '@/lib/api';
import type { Post } from '@/types';

export default function PostDetail({ post }: { post: Post }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!post || !post.id || !post.title) {
    return <div className="p-6 bg-red-100 text-red-600 rounded">잘못된 포스트 데이터</div>;
  }

  const handleDelete = async () => {
    if (!window.confirm(`'${post.title}' 포스트를 삭제하시겠습니까?`)) {
      return;
    }

    setDeleting(true);
    try {
      await deletePost(post.id);
      alert('포스트가 삭제되었습니다.');
      router.push('/posts');
    } catch (e) {
      const errorMsg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: unknown }).message)
          : '삭제 중 오류 발생';
      alert(errorMsg);
      setDeleting(false);
    }
  };

  return (
    <>
      <article className="p-6 bg-white rounded shadow" aria-label={`포스트 상세 ${post.title}`}>
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{post.title || '제목 없음'}</h1>
            <div className="text-sm text-gray-500">
              {post.dateTime || '날짜 없음'} | 회사: {post.resourceUid || '회사 없음'}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
            >
              편집
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring disabled:opacity-50"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
        <div className="prose max-w-none mb-4">{post.content || '내용 없음'}</div>
        <div className="mt-6">
          <Link
            href="/posts"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </article>
      <PostFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        post={post}
        onSuccess={() => {
          setModalOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
