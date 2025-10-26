import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

// Mock circles data
const mockCircles = [
  {
    id: '1',
    name: 'Tech Entrepreneurs',
    description: 'Supporting fellow tech entrepreneurs and startups',
    memberCount: 1,
    isOwner: true,
    owner: {
      id: 'user1',
      handle: 'demo_user',
      avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
      verified: true,
    },
    createdAt: '2025-01-20T00:00:00Z',
  },
];

// GET /api/circles - List user's circles
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: mockCircles,
    });

  } catch (error) {
    console.error('Error fetching circles:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch circles',
    }, { status: 500 });
  }
}

// POST /api/circles - Create new circle
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
    
    const newCircle = {
      id: `circle${Date.now()}`,
      name: body.name,
      description: body.description,
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

    mockCircles.push(newCircle);

    return NextResponse.json({
      success: true,
      data: newCircle,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating circle:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create circle',
    }, { status: 500 });
  }
}