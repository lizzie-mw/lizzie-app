import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];
type MaterialCommunityIconsName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconFamily = 'ionicons' | 'material';

const sizeMap: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

export interface IconProps {
  name: string;
  family?: IconFamily;
  size?: IconSize;
  color?: string;
}

export function Icon({ family = 'ionicons', name, size = 'md', color = '#374151' }: IconProps) {
  const iconSize = sizeMap[size];

  if (family === 'material') {
    return (
      <MaterialCommunityIcons
        name={name as MaterialCommunityIconsName}
        size={iconSize}
        color={color}
      />
    );
  }

  return (
    <Ionicons
      name={name as IoniconsName}
      size={iconSize}
      color={color}
    />
  );
}
