import { apiClient } from '@/shared/api';
import type {
  LizardResponse,
  LizardCreate,
  LizardUpdate,
  ImageUploadResponse,
} from '@/shared/api';

export const lizardApi = {
  getMyLizard: async (): Promise<LizardResponse | null> => {
    try {
      return await apiClient.get('lizards/me').json<LizardResponse>();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response?: { status?: number } };
        if (httpError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  createLizard: async (payload: LizardCreate): Promise<LizardResponse> => {
    return await apiClient.post('lizards', { json: payload }).json<LizardResponse>();
  },

  updateLizard: async (id: string, payload: LizardUpdate): Promise<LizardResponse> => {
    return await apiClient.patch(`lizards/${id}`, { json: payload }).json<LizardResponse>();
  },

  deleteLizard: async (id: string): Promise<void> => {
    await apiClient.delete(`lizards/${id}`);
  },

  getImageUploadUrl: async (
    id: string,
    contentType: string
  ): Promise<ImageUploadResponse> => {
    return await apiClient
      .post(`lizards/${id}/image/presigned-url`, {
        json: { content_type: contentType },
      })
      .json<ImageUploadResponse>();
  },

  updateImageUrl: async (id: string, imageUrl: string): Promise<void> => {
    await apiClient.patch(`lizards/${id}/image`, {
      json: { image_url: imageUrl },
    });
  },
};
