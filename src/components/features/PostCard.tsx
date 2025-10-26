'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  acceptContracts: boolean;
  status: 'open' | 'closed';
  owner: {
    handle: string;
    avatarUrl: string | null;
  };
  createdAt: Date;
  images: string[];
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const t = useTranslations('actions');
  const tCategories = useTranslations('categories');
  const tStatus = useTranslations('status');

  const progressPercentage = Math.min((post.raised / post.goal) * 100, 100);
  const isFullyFunded = post.raised >= post.goal;

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Medical': tCategories('medical'),
      'Funeral': tCategories('funeral'),
      'For fun': tCategories('for_fun'),
      'Vet bills': tCategories('vet_bills'),
      'Education': tCategories('education'),
      'Community Projects': tCategories('community_projects'),
      'Other': tCategories('other')
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden border border-gray-200/50">
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">
                  {post.owner.handle.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">@{post.owner.handle}</p>
              <p className="text-xs text-gray-500">
                {post.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
              post.status === 'open' 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {post.status === 'open' ? tStatus('open') : tStatus('closed')}
            </span>
            {post.acceptContracts && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg animate-pulse">
                Contracts
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {post.description}
          </p>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg">
              {getCategoryLabel(post.category)}
            </span>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-900">
              {post.raised.toLocaleString()} / {post.goal.toLocaleString()} GLM
            </span>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out relative ${
                isFullyFunded 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-blue-400 to-purple-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          {isFullyFunded && (
            <div className="mt-2 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse">
                🎉 Fully Funded!
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex space-x-3">
          <Link 
            href={`/posts/${post.id}`}
            className="group/btn flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          </Link>
          {post.status === 'open' && (
            <button className="group/btn bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {t('donate')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
