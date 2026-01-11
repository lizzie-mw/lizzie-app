import { View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';

type CardVariant = 'default' | 'gradient' | 'elevated';
type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white rounded-2xl',
  gradient: 'bg-white rounded-2xl border-2 border-primary-200',
  elevated: 'bg-white rounded-2xl shadow-lg',
};

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <View
      className={`
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className ?? ''}
      `}
      {...props}
    >
      {children}
    </View>
  );
}
