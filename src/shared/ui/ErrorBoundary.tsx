import { View, Text } from 'react-native';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from './Button';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-6xl mb-4">😵</Text>
      <Text className="text-xl font-bold text-gray-900 mb-2">
        앗, 문제가 발생했어요
      </Text>
      <Text className="text-gray-500 text-center mb-6">
        {error.message || '예상치 못한 오류가 발생했습니다.'}
      </Text>
      <Button onPress={resetErrorBoundary}>다시 시도</Button>
    </View>
  );
}

interface Props {
  children: React.ReactNode;
  onReset?: () => void;
}

export function ErrorBoundary({ children, onReset }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}
