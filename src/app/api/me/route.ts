import { NextRequest, NextResponse } from 'next/server';
import { getMockSession } from '@/lib/mock-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateProfileSchema = z.object({
  handle: z.string().min(3).max(30).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  locale: z.enum(['EN', 'ES']).optional(),
  interests: z.array(z.string()).optional(),
});

// GET /api/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = getMockSession(request);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    // Get or create user
    let user = await db.user.findUnique({
      where: { auth0Sub: session.user.sub },
      include: {
        _count: {
          select: {
            posts: true,
            pledges: true,
            circles: true,
          },
        },
      },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          auth0Sub: session.user.sub,
          email: session.user.email || '',
          handle: session.user.nickname || session.user.email?.split('@')[0] || 'user',
          avatarUrl: session.user.picture,
        },
        include: {
          _count: {
            select: {
              posts: true,
              pledges: true,
              circles: true,
            },
          },
        },
      });
    }

    // Get user's account balance
    const account = await db.account.findFirst({
      where: {
        ownerType: 'USER',
        ownerId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        balance: account?.balanceGLM || 0,
      },
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
    }, { status: 500 });
  }
}

// PATCH /api/me - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = getMockSession(request);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Get user
    const user = await db.user.findUnique({
      where: { auth0Sub: session.user.sub },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // Check if handle is already taken (if being updated)
    if (validatedData.handle && validatedData.handle !== user.handle) {
      const existingUser = await db.user.findUnique({
        where: { handle: validatedData.handle },
      });

      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: 'Handle already taken',
        }, { status: 400 });
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: validatedData,
      include: {
        _count: {
          select: {
            posts: true,
            pledges: true,
            circles: true,
          },
        },
      },
    });

    // Get user's account balance
    const account = await db.account.findFirst({
      where: {
        ownerType: 'USER',
        ownerId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedUser,
        balance: account?.balanceGLM || 0,
      },
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }, { status: 500 });
  }
}
