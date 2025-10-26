// Debug script to log Auth0 environment variables
export function logAuth0Config() {
  console.log('=== AUTH0 DEBUG INFO ===');
  console.log('AUTH0_SECRET:', process.env.AUTH0_SECRET ? 'SET' : 'NOT SET');
  console.log('AUTH0_BASE_URL:', process.env.AUTH0_BASE_URL);
  console.log('AUTH0_ISSUER_BASE_URL:', process.env.AUTH0_ISSUER_BASE_URL);
  console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID);
  console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
  console.log('========================');
}
