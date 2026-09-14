import api from './api';

export const photoService = {
  uploadPhotos: async (eventId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });

    const response = await api.post(`/events/${eventId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAdminPhotos: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}/photos`);
    return response.data;
  },

  togglePhotoSelection: async (photoId) => {
    const response = await api.put(`/admin/photos/${photoId}/select`);
    return response.data;
  },

  getTeamMemberPhotos: async (eventId) => {
    const response = await api.get(`/team/events/${eventId}/photos`);
    return response.data;
  },

  getMyPhotos: async () => {
    const response = await api.get('/team/photos/my');
    return response.data;
  },
};

export default photoService;
