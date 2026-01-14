import { View, Pressable, ActivityIndicator } from 'react-native';
import { Avatar, Icon } from '@/shared/ui';
import { haptics } from '@/shared/lib';
import { useImageUpload } from '../model/useImageUpload';

interface ImagePickerProps {
  lizardId: string;
  currentImageUrl?: string | null;
  lizardName?: string;
  size?: 'md' | 'lg' | 'xl';
  onSuccess?: () => void;
}

export function ImagePicker({
  lizardId,
  currentImageUrl,
  lizardName,
  size = 'xl',
  onSuccess,
}: ImagePickerProps) {
  const { isUploading, showImageOptions } = useImageUpload({
    lizardId,
    onSuccess,
  });

  const handlePress = () => {
    haptics.light();
    showImageOptions();
  };

  const sizeClass = {
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  return (
    <Pressable onPress={handlePress} disabled={isUploading}>
      <View className="relative">
        <Avatar uri={currentImageUrl} name={lizardName} size={size} />

        {isUploading && (
          <View
            className={`absolute inset-0 ${sizeClass} rounded-full bg-black/50 items-center justify-center`}
          >
            <ActivityIndicator color="white" />
          </View>
        )}

        {/* Edit badge */}
        <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 items-center justify-center border-2 border-white">
          <Icon name="camera" size="xs" color="#ffffff" />
        </View>
      </View>
    </Pressable>
  );
}
