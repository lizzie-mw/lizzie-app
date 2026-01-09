import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 1024;

interface ProcessedImage {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
}

export async function pickImage(): Promise<ProcessedImage | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return processImage(asset.uri, asset.width, asset.height);
}

export async function takePhoto(): Promise<ProcessedImage | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('카메라 접근 권한이 필요합니다.');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return processImage(asset.uri, asset.width, asset.height);
}

async function processImage(
  uri: string,
  width: number,
  height: number
): Promise<ProcessedImage> {
  // 리사이즈 필요 여부 확인
  const needsResize = width > MAX_DIMENSION || height > MAX_DIMENSION;

  const actions: ImageManipulator.Action[] = [];

  if (needsResize) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    actions.push({
      resize: {
        width: Math.round(width * scale),
        height: Math.round(height * scale),
      },
    });
  }

  const result = await ImageManipulator.manipulateAsync(
    uri,
    actions,
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
    mimeType: 'image/jpeg',
  };
}

export async function getImageSize(uri: string): Promise<number> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob.size;
}

export function isValidImageSize(size: number): boolean {
  return size <= MAX_IMAGE_SIZE;
}
