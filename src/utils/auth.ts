import { jwtDecode } from 'jwt-decode';

export interface DecodedUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthData {
  token: string | null;
  user: DecodedUser | null;
  isAuthenticated: boolean;
}

/**
 * Retrieves the JWT token from localStorage, decodes it with `jwt-decode`,
 * and returns the user's data and auth status.
 */
export const getAuthData = (): AuthData => {
  // Prevent SSR crashes in Next.js
  if (typeof window === 'undefined') {
    return { token: null, user: null, isAuthenticated: false };
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return { token: null, user: null, isAuthenticated: false };
  }

  try {
    // 1-liner to decode the token with full TypeScript types
    const decodedUser = jwtDecode<DecodedUser>(token);

    // Check expiration (exp is in seconds, Date.now() is in ms)
    if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { token: null, user: null, isAuthenticated: false };
    }

    return {
      token,
      user: decodedUser,
      isAuthenticated: true,
    };
  } catch (error) {
    // If the token is corrupt or tampered with
    console.error('Invalid token format:', error);
    localStorage.removeItem('token');
    return { token: null, user: null, isAuthenticated: false };
  }
};