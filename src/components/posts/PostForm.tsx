import { useForm } from '@tanstack/react-form';
import { useId, useState } from 'react';
import type { Post } from '@/types';
import { Button } from '../ui/button';

interface PostFormProps {
  initial?: Partial<Post>;
  onSubmit: (data: Omit<Post, 'id'>) => Promise<void>;
  loading?: boolean;
}

export default function PostForm({ initial, onSubmit, loading }: PostFormProps) {
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const resourceUidId = useId();
  const dateTimeId = useId();
  const contentId = useId();

  const form = useForm({
    defaultValues: {
      title: initial?.title ?? '',
      resourceUid: initial?.resourceUid ?? '',
      dateTime: initial?.dateTime ?? '',
      content: initial?.content ?? '',
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await onSubmit(value);
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'message' in e) {
          setError((e as { message?: string }).message || '저장 중 오류 발생');
        } else {
          setError('저장 중 오류 발생');
        }
      }
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      aria-live="polite"
    >
      <div>
        <label htmlFor={titleId} className="block font-medium">
          제목
        </label>
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => (!value ? '제목을 입력하세요.' : undefined),
          }}
        >
          {(field) => (
            <>
              <input
                id={titleId}
                name="title"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border rounded px-2 py-1 transition-all duration-200"
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={`${titleId}-error`}
              />
              {field.state.meta.errors.length > 0 && (
                <div id={`${titleId}-error`} className="text-red-500 text-sm">
                  {field.state.meta.errors[0]}
                </div>
              )}
            </>
          )}
        </form.Field>
      </div>
      <div>
        <label htmlFor={resourceUidId} className="block font-medium">
          회사 ID
        </label>
        <form.Field
          name="resourceUid"
          validators={{
            onChange: ({ value }) => (!value ? '회사 ID를 입력하세요.' : undefined),
          }}
        >
          {(field) => (
            <>
              <input
                id={resourceUidId}
                name="resourceUid"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border rounded px-2 py-1 transition-all duration-200"
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={`${resourceUidId}-error`}
              />
              {field.state.meta.errors.length > 0 && (
                <div id={`${resourceUidId}-error`} className="text-red-500 text-sm">
                  {field.state.meta.errors[0]}
                </div>
              )}
            </>
          )}
        </form.Field>
      </div>
      <div>
        <label htmlFor={dateTimeId} className="block font-medium">
          날짜 (YYYY-MM)
        </label>
        <form.Field
          name="dateTime"
          validators={{
            onChange: ({ value }) => (!value ? '날짜를 입력하세요.' : undefined),
          }}
        >
          {(field) => (
            <>
              <input
                id={dateTimeId}
                name="dateTime"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border rounded px-2 py-1 transition-all duration-200"
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={`${dateTimeId}-error`}
                placeholder="2025-01"
              />
              {field.state.meta.errors.length > 0 && (
                <div id={`${dateTimeId}-error`} className="text-red-500 text-sm">
                  {field.state.meta.errors[0]}
                </div>
              )}
            </>
          )}
        </form.Field>
      </div>
      <div>
        <label htmlFor={contentId} className="block font-medium">
          내용
        </label>
        <form.Field
          name="content"
          validators={{
            onChange: ({ value }) => (!value ? '내용을 입력하세요.' : undefined),
          }}
        >
          {(field) => (
            <>
              <textarea
                id={contentId}
                name="content"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border rounded px-2 py-1 transition-all duration-200"
                rows={4}
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={`${contentId}-error`}
              />
              {field.state.meta.errors.length > 0 && (
                <div id={`${contentId}-error`} className="text-red-500 text-sm">
                  {field.state.meta.errors[0]}
                </div>
              )}
            </>
          )}
        </form.Field>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={loading || !form.state.canSubmit}
      >
        {loading ? '저장 중...' : '저장'}
      </Button>
    </form>
  );
}
