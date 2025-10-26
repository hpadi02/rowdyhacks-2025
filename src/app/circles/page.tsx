'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Circle {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  isOwner: boolean;
  owner: {
    id: string;
    handle: string;
    avatarUrl?: string;
    verified: boolean;
  };
  createdAt: string;
}

interface Invitation {
  id: string;
  circleName: string;
  invitedBy: string;
  status: string;
  createdAt: string;
}

const CirclesPage = () => {
  // Mock user for testing
  const user = { sub: 'test-user' };
  const isLoading = false;
  const [activeTab, setActiveTab] = useState('my-circles');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [inviteUsername, setInviteUsername] = useState('');
  const [newCircle, setNewCircle] = useState({
    name: '',
    description: '',
    tags: ''
  });

  // State for API data
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for hackathon mode
  const mockCircles: Circle[] = [
    {
      id: '1',
      name: 'Tech Entrepreneurs',
      description: 'Supporting fellow tech entrepreneurs and startups',
      memberCount: 12,
      isOwner: true,
      owner: {
        id: 'user1',
        handle: 'demo_user',
        avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
        verified: true,
      },
      createdAt: '2025-01-20T00:00:00Z',
    },
    {
      id: '2',
      name: 'Community Health Advocates',
      description: 'Supporting health-related funding requests in the community.',
      memberCount: 8,
      isOwner: false,
      owner: {
        id: 'user2',
        handle: 'health_guru',
        avatarUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=HG',
        verified: true,
      },
      createdAt: '2025-01-15T00:00:00Z',
    },
  ];

  const mockInvitations: Invitation[] = [
    {
      id: 'inv_1',
      circleName: 'Local Artists Collective',
      invitedBy: 'ArtLover123',
      status: 'PENDING',
      createdAt: '2025-01-28T10:00:00Z',
    },
    {
      id: 'inv_2',
      circleName: 'Startup Founders Network',
      invitedBy: 'InnovatorX',
      status: 'PENDING',
      createdAt: '2025-01-21T15:30:00Z',
    },
  ];

  // Use mock data for now (hackathon mode)
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setCircles(mockCircles);
      setLoading(false);
    }, 500);
  }, []);

  const invitations: Invitation[] = [
    {
      id: 'inv_1',
      circleName: 'Local Business Network',
      invitedBy: 'business_leader',
      status: 'PENDING',
      createdAt: '2025-01-22T10:00:00Z',
    },
    {
      id: 'inv_2',
      circleName: 'Education Supporters',
      invitedBy: 'edu_advocate',
      status: 'PENDING',
      createdAt: '2025-01-21T15:30:00Z',
    },
  ];

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create new circle with mock data (hackathon mode)
      const newCircleData: Circle = {
        id: Date.now().toString(),
        name: newCircle.name,
        description: newCircle.description,
        memberCount: 1,
        isOwner: true,
        owner: {
          id: 'user1',
          handle: 'demo_user',
          avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
          verified: true,
        },
        createdAt: new Date().toISOString(),
      };

      setCircles(prev => [newCircleData, ...prev]);
      setShowCreateForm(false);
      setNewCircle({ name: '', description: '', tags: '' });
      alert('Circle created successfully!');
    } catch (err) {
      console.error('Error creating circle:', err);
      alert('Failed to create circle. Please try again.');
    }
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCircle || !inviteUsername) return;
    
    // Mock invite user
    alert(`Invitation sent to @${inviteUsername} for circle ${selectedCircle}! (Mock)`);
    setShowInviteForm(false);
    setInviteUsername('');
    setSelectedCircle(null);
  };

  const handleAcceptInvitation = (invitationId: string) => {
    alert(`Accepted invitation ${invitationId}! (Mock)`);
  };

  const handleDeclineInvitation = (invitationId: string) => {
    alert(`Declined invitation ${invitationId}! (Mock)`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading circles...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to view your circles.</p>
          <Link
            href="/api/auth/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sponsor Circles</h1>
              <p className="text-gray-600 mt-2">
                Connect with trusted sponsors and build funding communities
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInviteForm(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Invite User
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Circle
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('my-circles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-circles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Circles ({circles.length})
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invitations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Invitations ({invitations.length})
            </button>
          </nav>
        </div>

        {/* Create Circle Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Circle</h3>
              <form onSubmit={handleCreateCircle}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Circle Name
                  </label>
                  <input
                    type="text"
                    value={newCircle.name}
                    onChange={(e) => setNewCircle({ ...newCircle, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter circle name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCircle.description}
                    onChange={(e) => setNewCircle({ ...newCircle, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe your circle's purpose"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newCircle.tags}
                    onChange={(e) => setNewCircle({ ...newCircle, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tech, health, education (comma separated)"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Circle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite User Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite User to Circle</h3>
              <form onSubmit={handleInviteUser}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Circle
                  </label>
                  <select
                    value={selectedCircle || ''}
                    onChange={(e) => setSelectedCircle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a circle</option>
                    {circles.filter(c => c.isOwner).map(circle => (
                      <option key={circle.id} value={circle.id}>{circle.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter username (without @)"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteUsername('');
                      setSelectedCircle(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'my-circles' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading circles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading circles</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : circles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No circles yet</h3>
                <p className="text-gray-600 mb-4">Create your first sponsor circle to get started.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Circle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {circles.map((circle) => (
                  <div key={circle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{circle.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{circle.description}</p>
                      </div>
                      {circle.isOwner && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Owner
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <img
                        src={circle.owner.avatarUrl}
                        alt={circle.owner.handle}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{circle.owner.handle}</p>
                        {circle.owner.verified && (
                          <span className="inline-flex items-center text-xs text-green-600">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{circle.memberCount} members</span>
                      <span>Created {formatDate(circle.createdAt)}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        View Circle
                      </button>
                      {circle.isOwner && (
                        <button 
                          onClick={() => {
                            setSelectedCircle(circle.id);
                            setShowInviteForm(true);
                          }}
                          className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                        >
                          Invite
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Discover Circles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: '1',
                    name: 'Tech Entrepreneurs',
                    description: 'Supporting fellow tech entrepreneurs and startups',
                    members: 12,
                    totalFunded: 25000
                  },
                  {
                    id: '2', 
                    name: 'Community Health',
                    description: 'Supporting health-related funding requests',
                    members: 8,
                    totalFunded: 15000
                  },
                  {
                    id: '3',
                    name: 'Education Supporters',
                    description: 'Helping students and educational initiatives',
                    members: 15,
                    totalFunded: 30000
                  }
                ].map((circle) => (
                  <div key={circle.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{circle.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{circle.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>{circle.members} members</span>
                      <span>${circle.totalFunded.toLocaleString()} funded</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                      Request to Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h3>
              {invitations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending invitations</p>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{invitation.circleName}</h4>
                        <p className="text-sm text-gray-500">
                          Invited by {invitation.invitedBy} • {formatDate(invitation.createdAt)}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          invitation.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {invitation.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleDeclineInvitation(invitation.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Circle Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{circles.length}</div>
              <div className="text-sm text-gray-500">Circles Joined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$52,000</div>
              <div className="text-sm text-gray-500">Total Funded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-500">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-500">Successful Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CirclesPage;