export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
}

export interface LoginCredentials {
  identifier: string; // phone hoặc email
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  phoneNumber: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    activeMemberId?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
