import { Pressable, Text, View, ActivityIndicator, type PressableProps, type GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { haptics, usePressAnimation } from '@/shared/lib';
import { Icon, type IconFamily, type IconSize } from './Icon';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconFamily?: IconFamily;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

const iconSizeMap: Record<ButtonSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

const iconColorMap: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#374151',
  outline: '#374151',
  ghost: '#374151',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconFamily,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation({ scaleValue: 0.95 });

  const handlePress = (e: GestureResponderEvent) => {
    haptics.light();
    onPress?.(e);
  };

  const iconColor = iconColorMap[variant];
  const iconSize = iconSizeMap[size];

  return (
    <AnimatedPressable
      style={animatedStyle}
      className={`
        flex-row items-center justify-center
        ${variantStyles[variant].container}
        ${sizeStyles[size].container}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
      `}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : '#374151'}
          size="small"
        />
      ) : (
        <>
          {leftIcon && (
            <View className="mr-2">
              <Icon
                family={iconFamily}
                name={leftIcon}
                size={iconSize}
                color={iconColor}
              />
            </View>
          )}
          {typeof children === 'string' ? (
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
          {rightIcon && (
            <View className="ml-2">
              <Icon
                family={iconFamily}
                name={rightIcon}
                size={iconSize}
                color={iconColor}
              />
            </View>
          )}
        </>
      )}
    </AnimatedPressable>
  );
}
