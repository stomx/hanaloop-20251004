'use client';

import { cva } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

// Toast variants using CVA
const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border-2 p-4 pr-6 shadow-lg transition-all',
    'focus-visible:border-foreground/40 focus-visible:shadow-xl',
    'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
    'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
    'data-[state=open]:sm:slide-in-from-bottom-full',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground focus-visible:border-foreground/60',
        success:
          'success group border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100 focus-visible:border-green-500 dark:focus-visible:border-green-600',
        error:
          'destructive group border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100 focus-visible:border-red-500 dark:focus-visible:border-red-600',
        warning:
          'warning group border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100 focus-visible:border-yellow-500 dark:focus-visible:border-yellow-600',
        info: 'info group border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100 focus-visible:border-blue-500 dark:focus-visible:border-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastPayload {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

type ToastItem = Required<ToastPayload> & { id: string; visible: boolean };

const EVENT_NAME = 'app:toast:add';

// Toast API
const toast = {
  success(payload: Omit<ToastPayload, 'variant'>) {
    emitToast({ ...payload, variant: 'success' });
  },
  error(payload: Omit<ToastPayload, 'variant'>) {
    emitToast({ ...payload, variant: 'error' });
  },
  warning(payload: Omit<ToastPayload, 'variant'>) {
    emitToast({ ...payload, variant: 'warning' });
  },
  info(payload: Omit<ToastPayload, 'variant'>) {
    emitToast({ ...payload, variant: 'info' });
  },
  default(payload: Omit<ToastPayload, 'variant'>) {
    emitToast({ ...payload, variant: 'default' });
  },
};

function emitToast(payload: ToastPayload) {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<ToastPayload>(EVENT_NAME, { detail: payload });
  window.dispatchEvent(event);
}

// Toast Provider Component
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const closeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail || {};
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const item: ToastItem = {
        id,
        title: detail.title ?? '',
        description: detail.description ?? '',
        variant: detail.variant ?? 'default',
        durationMs: detail.durationMs ?? 4000,
        visible: false,
      };
      setToasts((prev) => [...prev, item]);

      // Trigger animation
      requestAnimationFrame(() => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)));
      });

      // Auto-dismiss
      window.setTimeout(() => closeToast(id), item.durationMs);
    };

    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  }, [closeToast]);

  return (
    <>
      {children}
      <div
        className="fixed top-0 z-[100] flex items-center max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => closeToast(toast.id)} />
        ))}
      </div>
    </>
  );
}

// Individual Toast Component
interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  toast: ToastItem;
  onClose: () => void;
}

function Toast({ toast, onClose, className, ...props }: ToastProps) {
  return (
    <div
      data-state={toast.visible ? 'open' : 'closed'}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Toast should be focusable for accessibility
      tabIndex={0}
      className={cn(
        toastVariants({ variant: toast.variant as ToastVariant }),
        !toast.visible && 'pointer-events-none opacity-0',
        className
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      {...props}
    >
      <div className="flex items-center gap-3 flex-1">
        <ToastIcon variant={toast.variant as ToastVariant} />
        <div className="grid gap-1 flex-1">
          {toast.title && (
            <div className="text-sm font-semibold leading-none tracking-tight">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm opacity-90 leading-snug">{toast.description}</div>
          )}
        </div>
      </div>
      <Button
        type="button"
        onClick={onClose}
        className="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-all hover:text-foreground hover:bg-foreground/10 focus-visible:opacity-100 focus-visible:outline-none focus-visible:border-2 focus-visible:border-foreground/50 group-hover:opacity-100"
        aria-label="닫기"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Toast Icon Component
function ToastIcon({ variant }: { variant: ToastVariant }) {
  const iconClasses = 'h-5 w-5 flex-shrink-0';

  switch (variant) {
    case 'success':
      return (
        <CheckCircle2
          className={cn(iconClasses, 'text-green-600 dark:text-green-400')}
          aria-hidden="true"
        />
      );
    case 'error':
      return (
        <XCircle className={cn(iconClasses, 'text-red-600 dark:text-red-400')} aria-hidden="true" />
      );
    case 'warning':
      return (
        <AlertCircle
          className={cn(iconClasses, 'text-yellow-600 dark:text-yellow-400')}
          aria-hidden="true"
        />
      );
    case 'info':
      return (
        <Info className={cn(iconClasses, 'text-blue-600 dark:text-blue-400')} aria-hidden="true" />
      );
    default:
      return null;
  }
}

export { ToastProvider, toast };
