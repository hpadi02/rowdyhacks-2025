'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocalData, setLocalData, addTransaction } from '@/lib/local-storage';
import { validateImageData, getImageInfo } from '@/lib/image-utils';

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
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [pledgeType, setPledgeType] = useState<'donation' | 'contract'>('donation');
  const [userBalance, setUserBalance] = useState(1000);

  // Enhanced console logging with user metadata and trust scores
  const logUserActivity = (action: string, metadata: any) => {
    const userMetadata = {
      userId: 'demo_user_123',
      handle: 'demo_user',
      trustScore: 85, // High trust score
      verificationStatus: 'verified',
      accountAge: '2 years',
      totalPledges: 12,
      totalDonated: 2500,
      reputation: 'excellent',
      riskLevel: 'low',
      timestamp: new Date().toISOString(),
      action,
      metadata
    };
    
    console.log('🔍 GoLoanMe User Activity:', userMetadata);
    console.log('📊 Trust Score Analysis:', {
      score: userMetadata.trustScore,
      level: userMetadata.trustScore >= 80 ? 'HIGH' : userMetadata.trustScore >= 60 ? 'MEDIUM' : 'LOW',
      factors: {
        verificationStatus: userMetadata.verificationStatus,
        accountAge: userMetadata.accountAge,
        totalPledges: userMetadata.totalPledges,
        reputation: userMetadata.reputation
      }
    });
  };

  // Use local storage for hackathon mode
  useEffect(() => {
    setLoading(true);
    logUserActivity('EXPLORE_PAGE_LOAD', { filters });
    
    // Simulate API delay
    setTimeout(() => {
      const localData = getLocalData();
      let filteredPosts = localData.posts;

      // Apply filters
      if (filters.category) {
        filteredPosts = filteredPosts.filter(post => 
          post.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      if (filters.status) {
        filteredPosts = filteredPosts.filter(post => 
          post.status.toLowerCase() === filters.status.toLowerCase()
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower)
        );
      }

      setPosts(filteredPosts);
      setUserBalance(localData.wallet.balance);
      setLoading(false);
      
      logUserActivity('POSTS_LOADED', { 
        count: filteredPosts.length, 
        filters,
        userBalance: localData.wallet.balance 
      });
    }, 500);
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

  const handlePledgeClick = (post: Post) => {
    setSelectedPost(post);
    setShowPledgeModal(true);
    logUserActivity('PLEDGE_MODAL_OPENED', { 
      postId: post.id, 
      postTitle: post.title,
      postOwner: post.owner.handle,
      postCategory: post.category
    });
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !pledgeAmount) return;

    const amount = parseFloat(pledgeAmount);
    if (amount <= 0 || amount > userBalance) {
      alert('Invalid amount or insufficient balance');
      return;
    }

    if (selectedPost.totalRaised >= selectedPost.goal) {
      alert('This post has already reached its funding goal!');
      return;
    }

    try {
      // Create transaction
      const transaction = {
        id: `txn_${Date.now()}`,
        type: 'DEBIT' as const,
        amountGLM: amount,
        refType: pledgeType === 'donation' ? 'DONATION' : 'CONTRACT_PLEDGE',
        refId: selectedPost.id,
        createdAt: new Date().toISOString(),
        note: `${pledgeType === 'donation' ? 'Donation' : 'Contract Pledge'} to "${selectedPost.title}"`
      };

      // Add transaction to local storage
      addTransaction(transaction);

      // Update post data
      const localData = getLocalData();
      const postIndex = localData.posts.findIndex(p => p.id === selectedPost.id);
      if (postIndex !== -1) {
        localData.posts[postIndex].totalRaised += amount;
        localData.posts[postIndex].pledgeCount += 1;
        if (localData.posts[postIndex].totalRaised >= localData.posts[postIndex].goal) {
          localData.posts[postIndex].status = 'FUNDED';
        }
        setLocalData(localData);
      }

      // Enhanced transaction logging
      logUserActivity('PLEDGE_COMPLETED', {
        transactionId: transaction.id,
        amount: amount,
        type: pledgeType,
        postId: selectedPost.id,
        postTitle: selectedPost.title,
        postOwner: selectedPost.owner.handle,
        newBalance: userBalance - amount,
        transactionDetails: {
          from: 'demo_user',
          to: selectedPost.owner.handle,
          amount: amount,
          currency: 'GLM',
          timestamp: transaction.createdAt,
          status: 'completed'
        }
      });

      console.log('💰 Transaction Details:', {
        transactionId: transaction.id,
        amount: amount,
        type: pledgeType,
        from: 'demo_user',
        to: selectedPost.owner.handle,
        postTitle: selectedPost.title,
        timestamp: transaction.createdAt,
        userBalance: userBalance - amount
      });

      // Reset form and close modal
      setPledgeAmount('');
      setPledgeType('donation');
      setShowPledgeModal(false);
      setSelectedPost(null);
      
      // Refresh data
      const updatedData = getLocalData();
      setPosts(updatedData.posts);
      setUserBalance(updatedData.wallet.balance);

      alert(`Successfully pledged ${formatAmount(amount)} to "${selectedPost.title}"!`);
      
    } catch (error) {
      console.error('Pledge error:', error);
      alert('Failed to process pledge. Please try again.');
    }
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
                {post.images && post.images.length > 0 && (() => {
                  const imageUrl = post.images[0];
                  const isValid = validateImageData(imageUrl);
                  const imageInfo = getImageInfo(imageUrl);
                  
                  console.log('🖼️ Image Display Check:', {
                    postId: post.id,
                    title: post.title,
                    isValid,
                    imageInfo,
                    urlLength: imageUrl.length,
                    urlStart: imageUrl.substring(0, 50) + '...',
                    isDataUrl: imageUrl.startsWith('data:'),
                    isFilePath: imageUrl.startsWith('/images/'),
                    isDemoImage: imageUrl.includes('medical.png') || imageUrl.includes('garden.png') || imageUrl.includes('smallbusiness.png')
                  });
                  
                  return (
                    <div className="h-48 bg-gray-200 relative">
                      {isValid ? (
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('🖼️ Image Load Error:', {
                              postId: post.id,
                              title: post.title,
                              imageInfo,
                              urlStart: imageUrl.substring(0, 100) + '...',
                              isDemoImage: imageUrl.includes('medical.png') || imageUrl.includes('garden.png') || imageUrl.includes('smallbusiness.png')
                            });
                            
                            // For demo images, try to show a specific placeholder
                            if (imageUrl.includes('medical.png')) {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkVFN0VCIi8+CjxwYXRoIGQ9Ik04OCA2MEgxMTJWODBIOThWNjBaIiBmaWxsPSIjRkY2QjYwIi8+CjxwYXRoIGQ9Ik04OCA5MEgxMTJWMTEwSDk4VjkwWiIgZmlsbD0iI0ZGNkI2MCIvPgo8cGF0aCBkPSJNODggMTIwSDExMlYxNDBIOThWMTIwWiIgZmlsbD0iI0ZGNkI2MCIvPgo8L3N2Zz4K';
                              e.currentTarget.alt = 'Medical Image (Demo)';
                            } else if (imageUrl.includes('garden.png')) {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjBGQ0YwIi8+CjxwYXRoIGQ9Ik04OCA2MEgxMTJWODBIOThWNjBaIiBmaWxsPSIjNDBBRjQwIi8+CjxwYXRoIGQ9Ik04OCA5MEgxMTJWMTEwSDk4VjkwWiIgZmlsbD0iIzQwQUY0MCIvPgo8cGF0aCBkPSJNODggMTIwSDExMlYxNDBIOThWMTIwWiIgZmlsbD0iIzQwQUY0MCIvPgo8L3N2Zz4K';
                              e.currentTarget.alt = 'Garden Image (Demo)';
                            } else if (imageUrl.includes('smallbusiness.png')) {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04OCA2MEgxMTJWODBIOThWNjBaIiBmaWxsPSIjMzM3QUI3Ii8+CjxwYXRoIGQ9Ik04OCA5MEgxMTJWMTEwSDk4VjkwWiIgZmlsbD0iIzMzN0FCNyIvPgo8cGF0aCBkPSJNODggMTIwSDExMlYxNDBIOThWMTIwWiIgZmlsbD0iIzMzN0FCNyIvPgo8L3N2Zz4K';
                              e.currentTarget.alt = 'Business Image (Demo)';
                            } else {
                              // Generic placeholder for other images
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04OCA2MEgxMTJWODBIOThWNjBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik04OCA5MEgxMTJWMTEwSDk4VjkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNODggMTIwSDExMlYxNDBIOThWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                              e.currentTarget.alt = 'Image failed to load';
                            }
                          }}
                          onLoad={() => {
                            console.log('✅ Image Loaded Successfully:', {
                              postId: post.id,
                              title: post.title,
                              imageInfo
                            });
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Invalid Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

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
                    {post.totalRaised >= post.goal ? (
                      <div className="px-4 py-2 bg-green-100 text-green-800 text-center rounded-md font-medium">
                        🎉 Funded!
                      </div>
                    ) : (
                      <button 
                        onClick={() => handlePledgeClick(post)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Pledge
                      </button>
                    )}
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

        {/* Pledge Modal */}
        {showPledgeModal && selectedPost && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Make a Pledge</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedPost.title}</h3>
                <p className="text-sm text-gray-600">by @{selectedPost.owner.handle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Goal: {formatAmount(selectedPost.goal)} | Raised: {formatAmount(selectedPost.totalRaised)}
                </p>
              </div>
              
              <form onSubmit={handlePledgeSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pledge Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pledgeType"
                        value="donation"
                        checked={pledgeType === 'donation'}
                        onChange={(e) => setPledgeType(e.target.value as 'donation' | 'contract')}
                        className="mr-2"
                      />
                      <span className="text-sm">Donation (No strings attached)</span>
                    </label>
                    {selectedPost.acceptContracts && (
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="pledgeType"
                          value="contract"
                          checked={pledgeType === 'contract'}
                          onChange={(e) => setPledgeType(e.target.value as 'donation' | 'contract')}
                          className="mr-2"
                        />
                        <span className="text-sm">Contract Pledge (With terms)</span>
                      </label>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (GLM)
                  </label>
                  <input
                    type="number"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    min="1"
                    max={userBalance}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your balance: {formatAmount(userBalance)}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPledgeModal(false);
                      setSelectedPost(null);
                      setPledgeAmount('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Make Pledge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}