import axios from 'axios';
import { Screenshot, Group, Task } from './types';

const API_BASE = '/api';

export const api = {
  // Screenshots
  uploadScreenshot: async (file: File, provider: 'claude' | 'deepseek', groupId?: string) => {
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('provider', provider);
    if (groupId) {
      formData.append('group_id', groupId);
    }
    const response = await axios.post<Screenshot>(`${API_BASE}/screenshots/upload`, formData);
    return response.data;
  },

  getScreenshots: async () => {
    const response = await axios.get<Screenshot[]>(`${API_BASE}/screenshots`);
    return response.data;
  },

  getScreenshot: async (id: string) => {
    const response = await axios.get<Screenshot>(`${API_BASE}/screenshots/${id}`);
    return response.data;
  },

  deleteScreenshot: async (id: string) => {
    await axios.delete(`${API_BASE}/screenshots/${id}`);
  },

  // Groups
  createGroup: async (data: { name: string; description?: string; color?: string }) => {
    const response = await axios.post<Group>(`${API_BASE}/groups`, data);
    return response.data;
  },

  getGroups: async () => {
    const response = await axios.get<Group[]>(`${API_BASE}/groups`);
    return response.data;
  },

  getGroup: async (id: string) => {
    const response = await axios.get<Group>(`${API_BASE}/groups/${id}`);
    return response.data;
  },

  updateGroup: async (id: string, data: Partial<Group>) => {
    const response = await axios.put<Group>(`${API_BASE}/groups/${id}`, data);
    return response.data;
  },

  deleteGroup: async (id: string) => {
    await axios.delete(`${API_BASE}/groups/${id}`);
  },

  // Tasks
  createTask: async (data: {
    title: string;
    description?: string;
    screenshot_id?: string;
    group_id?: string;
    status?: string;
    priority?: string;
    due_date?: string;
  }) => {
    const response = await axios.post<Task>(`${API_BASE}/tasks`, data);
    return response.data;
  },

  getTasks: async () => {
    const response = await axios.get<Task[]>(`${API_BASE}/tasks`);
    return response.data;
  },

  getTask: async (id: string) => {
    const response = await axios.get<Task>(`${API_BASE}/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await axios.put<Task>(`${API_BASE}/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    await axios.delete(`${API_BASE}/tasks/${id}`);
  },
};
