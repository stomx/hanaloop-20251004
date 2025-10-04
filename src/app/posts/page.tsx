import PostList from '@/components/posts/PostList';

export default function PostsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">포스트 목록</h1>
      <PostList />
    </main>
  );
}
