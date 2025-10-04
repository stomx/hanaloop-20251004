'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostForm from '@/components/posts/PostForm';
import { fetchPostById, updatePost } from '@/lib/api';
import type { CreatePostInput, Post } from '@/types';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!id) return;
    fetchPostById(id)
      .then(setPost)
      .catch((e) => {
        const errorMsg =
          e && typeof e === 'object' && 'message' in e
            ? String((e as { message?: unknown }).message)
            : '포스트를 불러오는 중 오류 발생';
        alert(errorMsg);
      })
      .finally(() => setFetching(false));
  }, [id]);

  async function handleSubmit(data: CreatePostInput) {
    if (!id) return;
    setLoading(true);
    try {
      await updatePost({ ...data, id });
      router.push(`/posts/${id}`);
    } catch (e) {
      const errorMsg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: unknown }).message)
          : '수정 중 오류 발생';
      alert(errorMsg);
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <main className="p-6 max-w-xl mx-auto">
        <div className="text-center">로딩 중...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="p-6 max-w-xl mx-auto">
        <div className="text-red-600">포스트를 찾을 수 없습니다.</div>
        <Link href="/posts" className="text-blue-600 hover:underline mt-4 inline-block">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">포스트 수정</h1>
        <Link
          href={`/posts/${id}`}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring"
        >
          취소
        </Link>
      </div>
      <PostForm initial={post} onSubmit={handleSubmit} loading={loading} />
    </main>
  );
}
