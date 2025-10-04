'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PostForm from '@/components/posts/PostForm';
import { toast } from '@/components/ui/toast';
import { createPost } from '@/lib/api';
import type { CreatePostInput } from '@/types';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: CreatePostInput) {
    setLoading(true);
    try {
      await createPost(data);
      router.push('/posts');
    } catch (e) {
      const errorMsg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: unknown }).message)
          : '저장 중 오류 발생';
      toast.error({ title: '저장 실패', description: errorMsg });
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">새 포스트 작성</h1>
        <Link
          href="/posts"
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-all inline-block"
        >
          취소
        </Link>
      </div>
      <PostForm onSubmit={handleSubmit} loading={loading} />
    </main>
  );
}
