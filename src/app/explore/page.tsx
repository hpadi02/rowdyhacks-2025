'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  totalRaised: number;
  pledgeCount: number;
  commentCount: number;
  status: string;
  acceptContracts: boolean;
  createdAt: string;
  owner: {
    id: string;
    handle: string;
    avatarUrl?: string;
    verified: boolean;
  };
  images: string[];
  links: string[];
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('q', filters.search);

        const response = await fetch(`/api/posts?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setPosts(data.data);
        } else {
          setError(data.error || 'Failed to fetch posts');
        }
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filters]);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace('$', '') + ' GLM';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'MEDICAL': 'bg-red-100 text-red-800',
      'EDUCATION': 'bg-blue-100 text-blue-800',
      'BUSINESS': 'bg-green-100 text-green-800',
      'COMMUNITY_PROJECTS': 'bg-purple-100 text-purple-800',
      'OTHER': 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.OTHER;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading posts</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Funding Requests</h1>
          <p className="text-gray-600 mt-2">Discover and support community funding initiatives</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search posts..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="MEDICAL">Medical</option>
                <option value="EDUCATION">Education</option>
                <option value="BUSINESS">Business</option>
                <option value="COMMUNITY_PROJECTS">Community Projects</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="FUNDED">Funded</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or check back later.</p>
            <Link href="/posts/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Post Image */}
                {post.images && post.images.length > 0 && (
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category.replace('_', ' ')}
                    </span>
                    {post.acceptContracts && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Accepts Contracts
                      </span>
                    )}
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatAmount(post.totalRaised)} of {formatAmount(post.goal)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(getProgressPercentage(post.totalRaised, post.goal))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                          post.status === 'FUNDED' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                        style={{ width: `${getProgressPercentage(post.totalRaised, post.goal)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{post.pledgeCount} pledges</span>
                    <span>{post.commentCount} comments</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  {/* Owner */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {post.owner.avatarUrl ? (
                        <img src={post.owner.avatarUrl} alt={post.owner.handle} className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="text-gray-600 font-medium text-sm">
                          {post.owner.handle.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.owner.handle}</p>
                      {post.owner.verified && (
                        <span className="inline-flex items-center text-xs text-green-600">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      href={`/posts/${post.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
              <div className="text-sm text-gray-500">Active Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(posts.reduce((sum, post) => sum + post.totalRaised, 0))}
              </div>
              <div className="text-sm text-gray-500">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {posts.reduce((sum, post) => sum + post.pledgeCount, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Pledges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {posts.filter(post => post.status === 'FUNDED').length}
              </div>
              <div className="text-sm text-gray-500">Fully Funded</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}