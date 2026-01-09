import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lizardApi, lizardKeys } from '@/entities/lizard';
import { pickImage, takePhoto, isValidImageSize, getImageSize } from '@/shared/lib';
import { haptics } from '@/shared/lib';

interface UseImageUploadOptions {
  lizardId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useImageUpload({ lizardId, onSuccess, onError }: UseImageUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      // 1. 이미지 크기 검증
      const size = await getImageSize(imageUri);
      if (!isValidImageSize(size)) {
        throw new Error('이미지 크기는 5MB 이하여야 합니다.');
      }

      // 2. Presigned URL 발급
      const { upload_url, image_url } = await lizardApi.getImageUploadUrl(
        lizardId,
        'image/jpeg'
      );

      // 3. S3 업로드
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      // 4. DB 업데이트
      await lizardApi.updateImageUrl(lizardId, image_url);

      return image_url;
    },
    onSuccess: () => {
      haptics.success();
      queryClient.invalidateQueries({ queryKey: lizardKeys.me() });
      onSuccess?.();
    },
    onError: (error: Error) => {
      haptics.error();
      onError?.(error);
    },
  });

  const handlePickImage = useCallback(async () => {
    try {
      setIsUploading(true);
      const image = await pickImage();

      if (image) {
        await uploadMutation.mutateAsync(image.uri);
      }
    } catch (error) {
      Alert.alert('오류', (error as Error).message || '이미지 선택에 실패했어요.');
    } finally {
      setIsUploading(false);
    }
  }, [uploadMutation]);

  const handleTakePhoto = useCallback(async () => {
    try {
      setIsUploading(true);
      const image = await takePhoto();

      if (image) {
        await uploadMutation.mutateAsync(image.uri);
      }
    } catch (error) {
      Alert.alert('오류', (error as Error).message || '사진 촬영에 실패했어요.');
    } finally {
      setIsUploading(false);
    }
  }, [uploadMutation]);

  const showImageOptions = useCallback(() => {
    Alert.alert('프로필 사진', '사진을 선택하세요', [
      { text: '취소', style: 'cancel' },
      { text: '카메라', onPress: handleTakePhoto },
      { text: '앨범에서 선택', onPress: handlePickImage },
    ]);
  }, [handlePickImage, handleTakePhoto]);

  return {
    isUploading: isUploading || uploadMutation.isPending,
    pickImage: handlePickImage,
    takePhoto: handleTakePhoto,
    showImageOptions,
    error: uploadMutation.error,
  };
}
