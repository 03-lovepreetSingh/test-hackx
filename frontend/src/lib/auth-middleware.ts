import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from './auth-storage';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'user' | 'judge' | 'admin' | 'organizer';
  isActive: boolean;
  isVerified: boolean;
}

export interface AuthRequest extends NextRequest {
  user?: AuthUser;
}

export function createAuthMiddleware(requiredRole?: 'user' | 'judge' | 'admin' | 'organizer') {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      // Get token from cookie
      const token = request.cookies.get('auth-token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      const authService = getAuthService();
      const verification = await authService.verifyToken(token);

      if (!verification.valid || !verification.user) {
        return NextResponse.json(
          { success: false, error: verification.error || 'Invalid authentication' },
          { status: 401 }
        );
      }

      // Check role permissions
      if (requiredRole) {
        const roleHierarchy = {
          'user': 1,
          'judge': 2,
          'organizer': 3,
          'admin': 4
        };

        const userRoleLevel = roleHierarchy[verification.user.role] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

        if (userRoleLevel < requiredRoleLevel) {
          return NextResponse.json(
            { success: false, error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
      }

      // Add user to request headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', verification.user.id);
      requestHeaders.set('x-user-role', verification.user.role);
      requestHeaders.set('x-user-username', verification.user.username);

      return null; // Continue to the actual route
    } catch (error) {
      console.error('❌ Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

export function requireAuth(requiredRole?: 'user' | 'judge' | 'admin' | 'organizer') {
  return function(handler: (request: NextRequest) => Promise<NextResponse>) {
    return async (request: NextRequest): Promise<NextResponse> => {
      const middleware = createAuthMiddleware(requiredRole);
      const middlewareResponse = await middleware(request);
      
      if (middlewareResponse) {
        return middlewareResponse;
      }

      return handler(request);
    };
  };
}

export function getCurrentUser(request: NextRequest): AuthUser | null {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    const username = request.headers.get('x-user-username');

    if (!userId || !userRole || !username) {
      return null;
    }

    return {
      id: userId,
      username,
      email: '', // Not included in headers for security
      fullName: '', // Not included in headers for security
      role: userRole as 'user' | 'judge' | 'admin' | 'organizer',
      isActive: true,
      isVerified: true
    };
  } catch (error) {
    console.error('❌ Error getting current user from headers:', error);
    return null;
  }
}

// Role-based access control helpers
export function canAccessJudgeDashboard(user: AuthUser): boolean {
  return user.role === 'judge' || user.role === 'admin' || user.role === 'organizer';
}

export function canAccessAdminPanel(user: AuthUser): boolean {
  return user.role === 'admin';
}

export function canOrganizeHackathons(user: AuthUser): boolean {
  return user.role === 'organizer' || user.role === 'admin';
}

export function canJudgeHackathons(user: AuthUser): boolean {
  return user.role === 'judge' || user.role === 'admin' || user.role === 'organizer';
}

export function canManageUsers(user: AuthUser): boolean {
  return user.role === 'admin';
}

export function canCreateProjects(user: AuthUser): boolean {
  return user.role === 'user' || user.role === 'judge' || user.role === 'admin' || user.role === 'organizer';
}

export function canViewAllProjects(user: AuthUser): boolean {
  return user.role === 'judge' || user.role === 'admin' || user.role === 'organizer';
}
