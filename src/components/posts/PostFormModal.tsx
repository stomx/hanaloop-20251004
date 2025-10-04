'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { createPost, updatePost } from '@/lib/api';
import type { CreatePostInput, Post } from '@/types';
import PostForm from './PostForm';

interface PostFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | null;
  onSuccess?: () => void;
}

export default function PostFormModal({ open, onOpenChange, post, onSuccess }: PostFormModalProps) {
  const [loading, setLoading] = useState(false);

  // 모달이 열릴 때마다 loading 상태 초기화
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setLoading(false);
    }
    onOpenChange(newOpen);
  };

  async function handleSubmit(data: CreatePostInput) {
    setLoading(true);
    try {
      if (post?.id) {
        await updatePost({ ...data, id: post.id });
      } else {
        await createPost(data);
      }
      setLoading(false);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? '포스트 수정' : '새 포스트 작성'}</DialogTitle>
          <DialogDescription>
            {post ? '포스트 정보를 수정합니다.' : '새로운 포스트를 작성합니다.'}
          </DialogDescription>
        </DialogHeader>
        <PostForm initial={post || undefined} onSubmit={handleSubmit} loading={loading} />
      </DialogContent>
    </Dialog>
  );
}
