import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

// Mock data for development
const mockPosts = [
  {
    id: '1',
    title: 'Medical Emergency Fund',
    description: 'Need help with unexpected medical expenses for my father\'s surgery. Any support would be greatly appreciated.',
    category: 'MEDICAL',
    images: [],
    links: [],
    acceptContracts: true,
    status: 'OPEN',
    goal: 5000,
    createdAt: '2025-01-25T00:00:00Z',
    updatedAt: '2025-01-25T00:00:00Z',
    owner: {
      id: 'user1',
      handle: 'demo_user',
      avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
      verified: true,
    },
    pledges: [],
    _count: {
      pledges: 0,
      comments: 0,
    },
    totalRaised: 0,
    pledgeCount: 0,
    commentCount: 0,
  },
  {
    id: '2',
    title: 'Education Fund for Coding Bootcamp',
    description: 'Seeking support to attend a 6-month coding bootcamp to transition into tech career.',
    category: 'EDUCATION',
    images: [],
    links: [],
    acceptContracts: false,
    status: 'OPEN',
    goal: 8000,
    createdAt: '2025-01-24T00:00:00Z',
    updatedAt: '2025-01-24T00:00:00Z',
    owner: {
      id: 'user1',
      handle: 'demo_user',
      avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
      verified: true,
    },
    pledges: [],
    _count: {
      pledges: 0,
      comments: 0,
    },
    totalRaised: 0,
    pledgeCount: 0,
    commentCount: 0,
  },
];

// GET /api/posts - List posts with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let filteredPosts = [...mockPosts];

    // Apply filters
    if (q) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(q.toLowerCase()) ||
        post.description.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredPosts,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredPosts.length,
        pages: 1,
      },
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch posts',
    }, { status: 500 });
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Create new post
    const newPost = {
      id: `post${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: {
        id: 'user1',
        handle: 'demo_user',
        avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
        verified: true,
      },
      pledges: [],
      _count: {
        pledges: 0,
        comments: 0,
      },
      totalRaised: 0,
      pledgeCount: 0,
      commentCount: 0,
    };

    mockPosts.push(newPost);

    return NextResponse.json({
      success: true,
      data: newPost,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create post',
    }, { status: 500 });
  }
}