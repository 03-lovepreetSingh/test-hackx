import { Hackathon } from '../app/types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Hackathon CRUD operations
  async getAllHackathons(ipns?: string): Promise<ApiResponse<Hackathon[]>> {
    const url = ipns ? `/hackathons?ipns=${encodeURIComponent(ipns)}` : '/hackathons';
    return this.request<Hackathon[]>(url);
  }

  async getHackathonById(id: string): Promise<ApiResponse<Hackathon>> {
    return this.request<Hackathon>(`/hackathons/${id}`);
  }

  async getHackathonBySlug(slug: string): Promise<ApiResponse<Hackathon>> {
    return this.request<Hackathon>(`/hackathons/slug/${slug}`);
  }

  async createHackathon(hackathon: Omit<Hackathon, 'id'>): Promise<ApiResponse<{ id: string }>> {
    return this.request<{ id: string }>('/hackathons', {
      method: 'POST',
      body: JSON.stringify(hackathon),
    });
  }

  async updateHackathon(id: string, hackathon: Hackathon): Promise<ApiResponse<void>> {
    return this.request<void>(`/hackathons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hackathon),
    });
  }

  async deleteHackathon(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/hackathons/${id}`, {
      method: 'DELETE',
    });
  }
}

// Singleton instance
let apiService: ApiService | null = null;

export function getApiService(): ApiService {
  if (!apiService) {
    apiService = new ApiService();
  }
  return apiService;
}
