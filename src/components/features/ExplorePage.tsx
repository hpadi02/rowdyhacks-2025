'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PostCard } from '@/components/features/PostCard';
import { CategoryFilter } from '@/components/features/CategoryFilter';
import { SearchBar } from '@/components/features/SearchBar';

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    title: 'Help with Medical Bills',
    description: 'Need $500 for surgery next month. Will repay within 6 months.',
    category: 'Medical',
    goal: 500,
    raised: 250,
    acceptContracts: true,
    status: 'open',
    owner: {
      handle: 'carmen_m',
      avatarUrl: null
    },
    createdAt: new Date('2024-01-15'),
    images: []
  },
  {
    id: '2',
    title: 'Community Garden Project',
    description: 'Starting a community garden in our neighborhood. Need funds for seeds and tools.',
    category: 'Community Projects',
    goal: 300,
    raised: 150,
    acceptContracts: false,
    status: 'open',
    owner: {
      handle: 'green_thumb',
      avatarUrl: null
    },
    createdAt: new Date('2024-01-14'),
    images: []
  },
  {
    id: '3',
    title: 'Pet Emergency Fund',
    description: 'My dog needs emergency surgery. Any help is appreciated.',
    category: 'Vet bills',
    goal: 800,
    raised: 800,
    acceptContracts: true,
    status: 'closed',
    owner: {
      handle: 'pet_lover',
      avatarUrl: null
    },
    createdAt: new Date('2024-01-10'),
    images: []
  }
];

export function ExplorePage() {
  const t = useTranslations('navigation');
  const tCategories = useTranslations('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Medical', label: tCategories('medical') },
    { value: 'Funeral', label: tCategories('funeral') },
    { value: 'For fun', label: tCategories('for_fun') },
    { value: 'Vet bills', label: tCategories('vet_bills') },
    { value: 'Education', label: tCategories('education') },
    { value: 'Community Projects', label: tCategories('community_projects') },
    { value: 'Other', label: tCategories('other') }
  ];

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('explore')}
          </h1>
          <p className="text-gray-600">
            Discover funding requests from your community
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search requests..."
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredPosts.length} request{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button className="btn-primary">
              Create New Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
