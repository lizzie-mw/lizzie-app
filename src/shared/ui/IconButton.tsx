import { Pressable, type PressableProps, type GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { haptics, usePressAnimation } from '@/shared/lib';
import { Icon, type IconFamily, type IconSize } from './Icon';

type IconButtonVariant = 'default' | 'primary' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: string;
  iconFamily?: IconFamily;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const variantStyles: Record<IconButtonVariant, { container: string; iconColor: string }> = {
  default: {
    container: 'bg-gray-100 active:bg-gray-200',
    iconColor: '#374151',
  },
  primary: {
    container: 'bg-primary-500 active:bg-primary-600',
    iconColor: '#ffffff',
  },
  ghost: {
    container: 'active:bg-gray-100',
    iconColor: '#6b7280',
  },
};

const sizeStyles: Record<IconButtonSize, { container: string; iconSize: IconSize }> = {
  sm: {
    container: 'w-8 h-8 rounded-lg',
    iconSize: 'sm',
  },
  md: {
    container: 'w-10 h-10 rounded-xl',
    iconSize: 'md',
  },
  lg: {
    container: 'w-12 h-12 rounded-xl',
    iconSize: 'lg',
  },
};

export function IconButton({
  icon,
  iconFamily,
  variant = 'default',
  size = 'md',
  disabled,
  onPress,
  ...props
}: IconButtonProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

  const handlePress = (e: GestureResponderEvent) => {
    haptics.light();
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      style={animatedStyle}
      className={`
        items-center justify-center
        ${variantStyles[variant].container}
        ${sizeStyles[size].container}
        ${disabled ? 'opacity-50' : ''}
      `}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      <Icon
        family={iconFamily}
        name={icon}
        size={sizeStyles[size].iconSize}
        color={variantStyles[variant].iconColor}
      />
    </AnimatedPressable>
  );
}
