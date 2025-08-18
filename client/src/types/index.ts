export type RecordingStatus = 'processing' | 'completed' | 'failed';

export interface Recording {
  id: string;
  userId: string;
  title: string;
  summary: string;
  transcription: string;
  durationSec: number;
  createdAt: string;
  status: RecordingStatus;
}

export interface Paginated<T> {
  items: T[];
  nextCursor?: string;
}

export interface LoginResponse {
  token: string;
}

export interface UploadResponse {
  id: string;
  status: 'processing';
}

export interface StatusResponse {
  status: RecordingStatus;
}