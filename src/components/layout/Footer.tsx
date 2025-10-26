'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('legal');

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">GoLoanMe</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              A transparent platform for community micro-funding with trust and clarity. 
              Building trust through accountability.
            </p>
            <p className="text-sm text-gray-500">
              {t('disclaimer')}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-gray-400 hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/posts/new" className="text-gray-400 hover:text-white transition-colors">Create Request</Link></li>
              <li><Link href="/wallet" className="text-gray-400 hover:text-white transition-colors">Wallet</Link></li>
              <li><Link href="/circles" className="text-gray-400 hover:text-white transition-colors">Circles</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
              <li><Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors">Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 GoLoanMe. Building trust through transparency.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
              <Link href="/security" className="text-gray-400 hover:text-white text-sm transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
