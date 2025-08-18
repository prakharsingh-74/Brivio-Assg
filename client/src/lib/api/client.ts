import { Recording, Paginated, LoginResponse, UploadResponse, StatusResponse } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }


  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Login failed');
    }
    return res.json();
  }

  async signup(email: string, password: string, confirmpassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, confirmpassword })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Signup failed');
    }
    return res.json();
  }

  getAuthHeaders(): HeadersInit {
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` };
    }
    return {};
  }

  async getRecordings(limit = 20, cursor?: string): Promise<Paginated<Recording>> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);
    const res = await fetch(`${API_BASE_URL}/recordings?${params.toString()}`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to fetch recordings');
    }
    const data = await res.json();
    // Map backend _id to id for frontend
    return {
      items: data.items.map((r: any) => ({
        ...r,
        id: r._id,
      })),
      nextCursor: data.nextCursor,
    };
  }

  async uploadRecording(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/recordings/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...this.getAuthHeaders(),
      },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Upload failed');
    }
    return res.json();
  }

  async getRecordingStatus(id: string): Promise<StatusResponse> {
    const res = await fetch(`${API_BASE_URL}/recordings/${id}/status`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to get status');
    }
    return res.json();
  }

  async getRecordingDetails(id: string): Promise<Recording> {
    const res = await fetch(`${API_BASE_URL}/recordings/${id}`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to get recording details');
    }
    const r = await res.json();
    return { ...r, id: r._id };
  }
}

export const apiClient = new ApiClient();