import { NextRequest, NextResponse } from 'next/server';
import { getMockSession } from '@/lib/mock-auth';
import { db as prisma } from '@/lib/db';

// GET /api/circles - List user's circles
export async function GET(request: NextRequest) {
  try {
    const session = getMockSession(request);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    // Get or create user from session
    let user = await prisma.user.findUnique({
      where: { auth0Sub: session.user.sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Sub: session.user.sub,
          email: session.user.email || '',
          handle: session.user.nickname || session.user.email?.split('@')[0] || 'user',
          avatarUrl: session.user.picture,
        },
      });
    }

    const userId = user.id;

    const circles = await prisma.circle.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { contains: userId } }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            handle: true,
            avatarUrl: true,
            verified: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match frontend expectations
    const transformedCircles = circles.map(circle => ({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      memberCount: JSON.parse(circle.members).length,
      isOwner: circle.ownerId === userId,
      owner: circle.owner,
      createdAt: circle.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: transformedCircles,
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
    const session = getMockSession(request);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    // Get or create user from session
    let user = await prisma.user.findUnique({
      where: { auth0Sub: session.user.sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Sub: session.user.sub,
          email: session.user.email || '',
          handle: session.user.nickname || session.user.email?.split('@')[0] || 'user',
          avatarUrl: session.user.picture,
        },
      });
    }

    const body = await request.json();
    const userId = user.id;

    const newCircle = await prisma.circle.create({
      data: {
        ownerId: userId,
        name: body.name,
        description: body.description,
        members: JSON.stringify([userId]), // Owner is the first member
      },
      include: {
        owner: {
          select: {
            id: true,
            handle: true,
            avatarUrl: true,
            verified: true,
          }
        }
      }
    });

    const transformedCircle = {
      id: newCircle.id,
      name: newCircle.name,
      description: newCircle.description,
      memberCount: JSON.parse(newCircle.members).length,
      isOwner: true,
      owner: newCircle.owner,
      createdAt: newCircle.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: transformedCircle,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating circle:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create circle',
    }, { status: 500 });
  }
}