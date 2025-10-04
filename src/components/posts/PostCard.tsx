import Link from 'next/link';
import type { Post } from '@/types';

export default function PostCard({ post }: { post: Post }) {
  if (!post || !post.id || !post.title) {
    return <div className="p-4 bg-red-100 text-red-600 rounded">잘못된 포스트 데이터</div>;
  }
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block p-4 bg-white rounded shadow hover:shadow-md"
      aria-label={`포스트 ${post.title}`}
    >
      <h2 className="text-lg font-semibold">{post.title || '제목 없음'}</h2>
      <div className="text-sm text-gray-500">
        {post.dateTime || '날짜 없음'} | 회사: {post.resourceUid || '회사 없음'}
      </div>
      <p className="mt-2 text-gray-700 line-clamp-2">{post.content || '내용 없음'}</p>
    </Link>
  );
}
