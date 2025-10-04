import { useRouter } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { fetchPostById, updatePost } from '@/lib/api';
import type { CreatePostInput } from '@/types';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await fetchPostById(params.id);
  const router = useRouter();
  async function handleSubmit(data: CreatePostInput) {
    await updatePost({ ...data, id: params.id });
    router.push(`/posts/${params.id}`);
  }
  if (!post) return <div>포스트를 찾을 수 없습니다.</div>;
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">포스트 수정</h1>
      <PostForm initial={post} onSubmit={handleSubmit} />
    </main>
  );
}
