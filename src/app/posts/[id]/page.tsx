import { notFound } from 'next/navigation';
import PostDetail from '@/components/posts/PostDetail';
import { fetchPostById } from '@/lib/api';

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await fetchPostById(params.id);
  if (!post) return notFound();
  return <PostDetail post={post} />;
}
