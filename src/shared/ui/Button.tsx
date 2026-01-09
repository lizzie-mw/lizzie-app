import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import { haptics } from '@/shared/lib';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-500 active:bg-primary-600',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-gray-100 active:bg-gray-200',
    text: 'text-gray-900',
  },
  outline: {
    container: 'border border-gray-300 active:bg-gray-50',
    text: 'text-gray-900',
  },
  ghost: {
    container: 'active:bg-gray-100',
    text: 'text-gray-700',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'px-3 py-2 rounded-lg',
    text: 'text-sm',
  },
  md: {
    container: 'px-4 py-3 rounded-xl',
    text: 'text-base',
  },
  lg: {
    container: 'px-6 py-4 rounded-xl',
    text: 'text-lg',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handlePress = (e: any) => {
    haptics.light();
    onPress?.(e);
  };

  return (
    <Pressable
      className={`
        flex-row items-center justify-center
        ${variantStyles[variant].container}
        ${sizeStyles[size].container}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
      `}
      disabled={isDisabled}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : '#374151'}
          size="small"
        />
      ) : typeof children === 'string' ? (
        <Text
          className={`
            font-semibold
            ${variantStyles[variant].text}
            ${sizeStyles[size].text}
          `}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
