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

  async getRecordings(limit = 20, cursor?: string): Promise<Paginated<Recording>> {
    // Mock data with delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockRecordings: Recording[] = [
      {
        id: '1',
        userId: 'user1',
        title: 'A sad song',
        summary: 'Fugiat ipsum consequat aliquam ultrices lacus. Tellus lorem ipsum dolor sit amet, consectetur elit.',
        durationSec: 204, // 3:24
        createdAt: '2025-08-01T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        userId: 'user1',
        title: 'My personal recording',
        summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
        durationSec: 204,
        createdAt: '2025-07-31T14:20:00Z',
        status: 'completed'
      },
      {
        id: '3',
        userId: 'user1',
        title: 'Interview Recording',
        summary: 'Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        durationSec: 3624, // 01:00:24
        createdAt: '2025-08-15T09:15:00Z',
        status: 'completed'
      },
      {
        id: '4',
        userId: 'user1',
        title: 'Untitled Recording',
        summary: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
        durationSec: 24,
        createdAt: '2025-07-25T16:45:00Z',
        status: 'completed'
      },
      {
        id: '5',
        userId: 'user1',
        title: 'Untitled Recording (1)',
        summary: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
        durationSec: 320, // 5:20
        createdAt: '2025-07-27T11:30:00Z',
        status: 'completed'
      },
    ];

    // Simulate infinite scroll
    const startIndex = cursor ? parseInt(cursor) : 0;
    const endIndex = Math.min(startIndex + limit, mockRecordings.length);
    const items = mockRecordings.slice(startIndex, endIndex);
    const nextCursor = endIndex < mockRecordings.length ? endIndex.toString() : undefined;

    return { items, nextCursor };
  }

  async uploadRecording(file: File): Promise<UploadResponse> {
    // Mock upload with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const formData = new FormData();
    formData.append('file', file);
    
    return {
      id: `recording-${Date.now()}`,
      status: 'processing'
    };
  }

  async getRecordingStatus(id: string): Promise<StatusResponse> {
    // Mock status check with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate processing for 10 seconds, then completed
    const uploadTime = parseInt(id.split('-')[1] || '0');
    const elapsed = Date.now() - uploadTime;
    
    if (elapsed < 10000) {
      return { status: 'processing' };
    }
    
    return { status: 'completed' };
  }
}

export const apiClient = new ApiClient();