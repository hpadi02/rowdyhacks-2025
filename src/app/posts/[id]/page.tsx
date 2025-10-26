'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalData, setLocalData, addTransaction } from '@/lib/local-storage';

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

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [pledgeType, setPledgeType] = useState<'donation' | 'contract'>('donation');
  const [userBalance, setUserBalance] = useState(1000);
  const [isOwner, setIsOwner] = useState(false);

  // Enhanced console logging
  const logUserActivity = (action: string, metadata: any) => {
    const userMetadata = {
      userId: 'demo_user_123',
      handle: 'demo_user',
      trustScore: 85,
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
  };

  useEffect(() => {
    setLoading(true);
    logUserActivity('POST_DETAIL_LOAD', { postId: params.id });
    
    // Simulate API delay
    setTimeout(() => {
      const localData = getLocalData();
      const foundPost = localData.posts.find(p => p.id === params.id);
      
      if (foundPost) {
        setPost(foundPost);
        setIsOwner(foundPost.owner.id === 'demo_user_123');
        setUserBalance(localData.wallet.balance);
        
        logUserActivity('POST_LOADED', {
          postId: foundPost.id,
          title: foundPost.title,
          isOwner,
          totalRaised: foundPost.totalRaised,
          goal: foundPost.goal,
          isFullyFunded: foundPost.totalRaised >= foundPost.goal
        });
      } else {
        logUserActivity('POST_NOT_FOUND', { postId: params.id });
      }
      
      setLoading(false);
    }, 500);
  }, [params.id]);

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

  const isFullyFunded = post ? post.totalRaised >= post.goal : false;

  const handleDeletePost = () => {
    if (!post || !isOwner) return;
    
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      const localData = getLocalData();
      localData.posts = localData.posts.filter(p => p.id !== post.id);
      setLocalData(localData);
      
      logUserActivity('POST_DELETED', {
        postId: post.id,
        title: post.title,
        totalRaised: post.totalRaised
      });
      
      console.log('🗑️ Post Deleted:', {
        id: post.id,
        title: post.title,
        totalRaised: post.totalRaised
      });
      
      alert('Post deleted successfully!');
      router.push('/explore');
    }
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !pledgeAmount) return;

    const amount = parseFloat(pledgeAmount);
    if (amount <= 0 || amount > userBalance) {
      alert('Invalid amount or insufficient balance');
      return;
    }

    if (isFullyFunded) {
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
        refId: post.id,
        createdAt: new Date().toISOString(),
        note: `${pledgeType === 'donation' ? 'Donation' : 'Contract Pledge'} to "${post.title}"`
      };

      // Add transaction to local storage
      addTransaction(transaction);

      // Update post data
      const localData = getLocalData();
      const postIndex = localData.posts.findIndex(p => p.id === post.id);
      if (postIndex !== -1) {
        localData.posts[postIndex].totalRaised += amount;
        localData.posts[postIndex].pledgeCount += 1;
        if (localData.posts[postIndex].totalRaised >= localData.posts[postIndex].goal) {
          localData.posts[postIndex].status = 'FUNDED';
        }
        setLocalData(localData);
        
        // Update local state
        setPost(localData.posts[postIndex]);
      }

      logUserActivity('PLEDGE_COMPLETED', {
        transactionId: transaction.id,
        amount: amount,
        type: pledgeType,
        postId: post.id,
        postTitle: post.title,
        newBalance: userBalance - amount,
        isFullyFunded: (post.totalRaised + amount) >= post.goal
      });

      console.log('💰 Pledge Completed:', {
        transactionId: transaction.id,
        amount: amount,
        type: pledgeType,
        postId: post.id,
        postTitle: post.title,
        newBalance: userBalance - amount
      });

      // Reset form and close modal
      setPledgeAmount('');
      setPledgeType('donation');
      setShowPledgeModal(false);
      
      // Update user balance
      setUserBalance(userBalance - amount);

      alert(`Successfully pledged ${formatAmount(amount)} to "${post.title}"!`);
      
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
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Post not found</h3>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/explore')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  post.status === 'FUNDED' 
                    ? 'bg-green-100 text-green-800' 
                    : post.status === 'OPEN'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {post.status}
                </span>
                <span className="text-sm text-gray-500">{post.category}</span>
                {isFullyFunded && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    🎉 Fully Funded!
                  </span>
                )}
              </div>
              {isOwner && (
                <button
                  onClick={handleDeletePost}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete Post
                </button>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {post.owner.avatarUrl ? (
                    <img src={post.owner.avatarUrl} alt={post.owner.handle} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {post.owner.handle.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">@{post.owner.handle}</span>
                    {post.owner.verified && (
                      <span className="text-blue-600 text-sm">✓ Verified</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              {post.description}
            </p>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${post.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-900">
                  {formatAmount(post.totalRaised)} of {formatAmount(post.goal)}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(getProgressPercentage(post.totalRaised, post.goal))}% funded
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isFullyFunded 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}
                  style={{ width: `${getProgressPercentage(post.totalRaised, post.goal)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>{post.pledgeCount} pledges</span>
                <span>{post.commentCount} comments</span>
              </div>
            </div>

            {/* Contract Terms */}
            {post.acceptContracts && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Contract Terms</h3>
                <p className="text-blue-800">This post accepts contract pledges with custom terms.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!isFullyFunded ? (
                <button 
                  onClick={() => setShowPledgeModal(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
                >
                  Make a Pledge
                </button>
              ) : (
                <div className="flex-1 bg-green-100 text-green-800 font-medium py-3 px-6 rounded-lg text-center">
                  🎉 Funding Goal Reached!
                </div>
              )}
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Pledges Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Pledges ({post.pledgeCount})
            </h2>
            
            <div className="text-center text-gray-500 py-8">
              No pledges yet. Be the first to pledge!
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({post.commentCount})
            </h2>
            
            <div className="mb-4">
              <textarea
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                  Post Comment
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </div>
          </div>
        </div>

        {/* Pledge Modal */}
        {showPledgeModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Make a Pledge</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-600">by @{post.owner.handle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Goal: {formatAmount(post.goal)} | Raised: {formatAmount(post.totalRaised)}
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
                    {post.acceptContracts && (
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
