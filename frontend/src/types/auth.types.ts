export interface User {
  id: string;
  phoneNumber?: string | null;
  phone_number?: string | null;
  email?: string;
  fullName?: string;
  full_name?: string;
  avatarUrl?: string;
  role?: string;
  activeMemberId?: string;
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  address?: string;
  nationalId?: string;
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
    details?: any;
  };
}
