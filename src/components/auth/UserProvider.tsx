'use client';

// Use MockAuth instead of Auth0
import { UserProvider as MockUserProvider } from './MockAuth';

export function UserProvider({ children }: { children: React.ReactNode }) {
  return <MockUserProvider>{children}</MockUserProvider>;
}
