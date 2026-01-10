import { Avatar } from '@/shared/ui';
import type { Lizard } from '../model/types';

interface LizardAvatarProps {
  lizard: Lizard | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LizardAvatar({ lizard, size = 'md' }: LizardAvatarProps) {
  return (
    <Avatar
      uri={lizard?.profile_image_url}
      name={lizard?.name}
      size={size}
    />
  );
}
