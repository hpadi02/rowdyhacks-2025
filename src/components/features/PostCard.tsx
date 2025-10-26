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
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {post.owner.handle.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">@{post.owner.handle}</p>
            <p className="text-xs text-gray-500">
              {post.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            post.status === 'open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {post.status === 'open' ? tStatus('open') : tStatus('closed')}
          </span>
          {post.acceptContracts && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Contracts
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {post.description}
        </p>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
            {getCategoryLabel(post.category)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900">
            {post.raised} / {post.goal} GLM
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isFullyFunded ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Link 
          href={`/posts/${post.id}`}
          className="flex-1 btn-primary text-center"
        >
          View Details
        </Link>
        {post.status === 'open' && (
          <button className="btn-outline">
            {t('donate')}
          </button>
        )}
      </div>
    </div>
  );
}
