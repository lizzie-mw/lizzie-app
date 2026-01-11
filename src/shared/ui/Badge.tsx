import { View, Text } from 'react-native';

type BadgeVariant = 'primary' | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  count?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
};

const sizeStyles: Record<BadgeSize, { container: string; text: string }> = {
  sm: {
    container: 'min-w-4 h-4 px-1',
    text: 'text-[10px]',
  },
  md: {
    container: 'min-w-5 h-5 px-1.5',
    text: 'text-xs',
  },
};

export function Badge({
  count,
  variant = 'primary',
  size = 'sm',
}: BadgeProps) {
  if (count === undefined || count <= 0) {
    return null;
  }

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View
      className={`
        rounded-full items-center justify-center
        ${variantStyles[variant]}
        ${sizeStyles[size].container}
      `}
    >
      <Text
        className={`
          font-bold text-white
          ${sizeStyles[size].text}
        `}
      >
        {displayCount}
      </Text>
    </View>
  );
}
