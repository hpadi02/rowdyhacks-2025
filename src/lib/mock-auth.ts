// Mock authentication for development when Auth0 is not configured
// This allows the app to work without Auth0 setup

export interface MockSession {
  user: {
    sub: string;
    email: string;
    name: string;
    nickname: string;
    picture?: string;
  };
}

// Default mock user for development
const DEFAULT_MOCK_USER = {
  sub: 'mock|demo-user-123',
  email: 'demo@example.com',
  name: 'Demo User',
  nickname: 'demo-user',
  picture: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
};

// Get mock session from request headers or use default
export function getMockSession(request?: Request): MockSession | null {
  // Check for mock user in headers (set by client)
  const mockUserId = request?.headers.get('x-mock-user-id');
  const mockUserEmail = request?.headers.get('x-mock-user-email');
  const mockUserName = request?.headers.get('x-mock-user-name');

  if (mockUserId && mockUserEmail && mockUserName) {
    return {
      user: {
        sub: mockUserId,
        email: mockUserEmail,
        name: mockUserName,
        nickname: mockUserEmail.split('@')[0],
        picture: request?.headers.get('x-mock-user-picture') || undefined,
      },
    };
  }

  // Return default mock user for development
  return {
    user: DEFAULT_MOCK_USER,
  };
}

// Helper to get user ID from session
export function getMockUserId(session: MockSession | null): string | null {
  return session?.user?.sub || null;
}

