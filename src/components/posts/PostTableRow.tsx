import type { Post } from '@/types';
import { Button } from '../ui/button';

interface PostTableRowProps {
  post: Post;
  companyName?: string;
}

export default function PostTableRow({ post, companyName }: PostTableRowProps) {
  return (
    <tr className="border-b hover:bg-gray-50" aria-label={`포스트 ${post.title || '제목 없음'}`}>
      <td className="px-2 py-1 text-sm text-gray-800">
        {post.title || <span className="text-gray-400">제목 없음</span>}
      </td>
      <td className="px-2 py-1 text-sm text-gray-600">
        {companyName || post.resourceUid || <span className="text-gray-400">회사 없음</span>}
      </td>
      <td className="px-2 py-1 text-sm text-gray-500">{post.dateTime || '-'}</td>
      <td className="px-2 py-1 text-sm text-gray-700 line-clamp-1">
        {post.content ? (
          post.content.slice(0, 40)
        ) : (
          <span className="text-gray-400">내용 없음</span>
        )}
      </td>
      <td className="px-2 py-1 flex gap-2">
        {/* SSR에서는 UI만 렌더, CSR에서만 onClick 등 동작 구현 */}
        <Button
          type="button"
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 focus:outline-none focus:ring"
          aria-label="편집"
        >
          편집
        </Button>
        <Button
          type="button"
          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 focus:outline-none focus:ring"
          aria-label="삭제"
        >
          삭제
        </Button>
      </td>
    </tr>
  );
}
