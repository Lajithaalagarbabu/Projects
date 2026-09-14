import api from './api';

export const galleryService = {
  // Admin APIs
  createGallery: async (eventId, pin) => {
    const response = await api.post(`/admin/events/${eventId}/gallery`, { pin });
    return response.data;
  },

  getGalleryByEvent: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}/gallery`);
    return response.data;
  },

  publishGallery: async (galleryId) => {
    const response = await api.post(`/admin/galleries/${galleryId}/publish`);
    return response.data;
  },

  // Customer Public APIs
  getPublicGalleryInfo: async (galleryCode) => {
    const response = await api.get(`/public/gallery/${galleryCode}`);
    return response.data;
  },

  verifyPin: async (galleryCode, pin) => {
    const response = await api.post(`/public/gallery/${galleryCode}/verify`, { pin });
    return response.data;
  },

  getPublicPhotos: async (galleryCode, token) => {
    const response = await api.get(`/public/gallery/${galleryCode}/photos`, {
      headers: {
        'X-Gallery-Token': token,
      },
    });
    return response.data;
  },
};

export default galleryService;
