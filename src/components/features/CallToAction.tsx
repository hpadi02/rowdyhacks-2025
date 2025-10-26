'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function CallToAction() {
  const t = useTranslations('navigation');

  return (
    <div className="py-20 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Journey?
        </h2>
        
        <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
          Join a community that values transparency, trust, and mutual support
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/posts/new" 
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            Create Your Account
          </Link>
          <Link 
            href="/explore" 
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            Browse Requests
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-primary-100">Transparent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">Clear</div>
            <div className="text-primary-100">Terms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">Community</div>
            <div className="text-primary-100">Driven</div>
          </div>
        </div>
      </div>
    </div>
  );
}
