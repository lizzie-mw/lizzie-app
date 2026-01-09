import { apiClient } from '@/shared/api';
import type { Lizard, LizardCreate, LizardUpdate } from '../model/types';

export const lizardApi = {
  getMyLizard: async (): Promise<Lizard | null> => {
    try {
      return await apiClient.get('lizards/me').json<Lizard>();
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createLizard: async (payload: LizardCreate): Promise<Lizard> => {
    return await apiClient.post('lizards', { json: payload }).json<Lizard>();
  },

  updateLizard: async (id: string, payload: LizardUpdate): Promise<Lizard> => {
    return await apiClient.patch(`lizards/${id}`, { json: payload }).json<Lizard>();
  },

  deleteLizard: async (id: string): Promise<void> => {
    await apiClient.delete(`lizards/${id}`);
  },

  getImageUploadUrl: async (
    id: string,
    contentType: string
  ): Promise<{ upload_url: string; image_url: string }> => {
    return await apiClient
      .post(`lizards/${id}/image/presigned-url`, {
        json: { content_type: contentType },
      })
      .json();
  },

  updateImageUrl: async (id: string, imageUrl: string): Promise<void> => {
    await apiClient.patch(`lizards/${id}/image`, {
      json: { image_url: imageUrl },
    });
  },
};
