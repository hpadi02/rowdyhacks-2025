import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/components/auth/UserProvider';
import { AuthHeader } from '@/components/layout/AuthHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoLoanMe - Community Micro-Funding Platform',
  description: 'A transparent platform for community micro-funding with trust and clarity. Build trust through accountability.',
  keywords: 'community funding, micro-funding, transparency, trust, GLM credits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <div className="min-h-screen flex flex-col">
          <div className="bg-yellow-50 border-b border-yellow-200 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-yellow-800">
                Simulated currency. Not financial or legal advice. Not a money transmitter.
              </p>
            </div>
          </div>
          <AuthHeader />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <span className="text-xl font-bold">GoLoanMe</span>
                </div>
                <p className="text-gray-400 mb-4">
                  A transparent platform for community micro-funding with trust and clarity.
                </p>
                <p className="text-sm text-gray-500">
                  © 2025 GoLoanMe. Building trust through transparency.
                </p>
              </div>
            </div>
          </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
