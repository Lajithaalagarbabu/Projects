import api from './api';

export const eventService = {
  // Admin APIs
  createEvent: async (eventData) => {
    const response = await api.post('/admin/events', eventData);
    return response.data;
  },

  getAdminEvents: async () => {
    const response = await api.get('/admin/events');
    return response.data;
  },

  getAdminEventById: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}`);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/admin/events/${eventId}`);
    return response.data;
  },

  getAvailableTeamMembers: async () => {
    const response = await api.get('/admin/users/team-members');
    return response.data;
  },

  getEventMembers: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}/members`);
    return response.data;
  },

  addMemberToEvent: async (eventId, userId) => {
    const response = await api.post(`/admin/events/${eventId}/members`, { userId });
    return response.data;
  },

  removeMemberFromEvent: async (eventId, userId) => {
    const response = await api.delete(`/admin/events/${eventId}/members/${userId}`);
    return response.data;
  },

  // Team Member APIs
  getTeamMemberEvents: async () => {
    const response = await api.get('/team/events');
    return response.data;
  },

  getTeamMemberEventById: async (eventId) => {
    const response = await api.get(`/team/events/${eventId}`);
    return response.data;
  },
};

export default eventService;
