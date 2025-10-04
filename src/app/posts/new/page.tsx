import { useRouter } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { createPost } from '@/lib/api';
import type { CreatePostInput } from '@/types';

export default function NewPostPage() {
  const router = useRouter();
  async function handleSubmit(data: CreatePostInput) {
    await createPost(data);
    router.push('/posts');
  }
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">새 포스트 작성</h1>
      <PostForm onSubmit={handleSubmit} />
    </main>
  );
}
