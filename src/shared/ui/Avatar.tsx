import { View, Text } from 'react-native';
import { Image } from 'expo-image';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; pixels: number }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs', pixels: 32 },
  md: { container: 'w-12 h-12', text: 'text-base', pixels: 48 },
  lg: { container: 'w-16 h-16', text: 'text-xl', pixels: 64 },
  xl: { container: 'w-24 h-24', text: 'text-3xl', pixels: 96 },
};

export function Avatar({ uri, name, size = 'md' }: AvatarProps) {
  const styles = sizeStyles[size];
  const initial = name?.charAt(0).toUpperCase() || '🦎';

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`${styles.container} rounded-full bg-gray-200`}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      className={`${styles.container} rounded-full bg-primary-100 items-center justify-center`}
    >
      <Text className={`${styles.text} text-primary-600`}>{initial}</Text>
    </View>
  );
}
