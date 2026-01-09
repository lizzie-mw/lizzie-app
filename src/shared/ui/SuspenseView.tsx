import { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Loading } from './Loading';

interface SuspenseViewProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingMessage?: string;
  onReset?: () => void;
}

export function SuspenseView({
  children,
  fallback,
  loadingMessage,
  onReset,
}: SuspenseViewProps) {
  return (
    <ErrorBoundary onReset={onReset}>
      <Suspense fallback={fallback || <Loading fullScreen message={loadingMessage} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
