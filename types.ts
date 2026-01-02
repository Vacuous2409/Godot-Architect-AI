export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface GodotMechanicRequest {
  mechanicDescription: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}
