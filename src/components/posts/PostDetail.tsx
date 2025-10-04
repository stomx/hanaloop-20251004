import type { Post } from '@/types';

export default function PostDetail({ post }: { post: Post }) {
  if (!post || !post.id || !post.title) {
    return <div className="p-6 bg-red-100 text-red-600 rounded">잘못된 포스트 데이터</div>;
  }
  return (
    <article className="p-6 bg-white rounded shadow" aria-label={`포스트 상세 ${post.title}`}>
      <h1 className="text-2xl font-bold mb-2">{post.title || '제목 없음'}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {post.dateTime || '날짜 없음'} | 회사: {post.resourceUid || '회사 없음'}
      </div>
      <div className="prose max-w-none">{post.content || '내용 없음'}</div>
    </article>
  );
}
