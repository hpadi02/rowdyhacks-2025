import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db } from '@/lib/db';
import { z } from 'zod';

const inviteUserSchema = z.object({
  handle: z.string().min(3).max(30),
});

// POST /api/circles/[id]/invite - Invite user to circle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = inviteUserSchema.parse(body);

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

    // Check if circle exists and user is owner
    const circle = await db.circle.findUnique({
      where: { id: params.id },
      select: { ownerId: true, members: true },
    });

    if (!circle) {
      return NextResponse.json({
        success: false,
        error: 'Circle not found',
      }, { status: 404 });
    }

    if (circle.ownerId !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Not authorized to invite users to this circle',
      }, { status: 403 });
    }

    // Find user to invite
    const userToInvite = await db.user.findUnique({
      where: { handle: validatedData.handle },
      select: { id: true, handle: true, avatarUrl: true, verified: true },
    });

    if (!userToInvite) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // Check if user is already a member
    if (circle.members.includes(userToInvite.id)) {
      return NextResponse.json({
        success: false,
        error: 'User is already a member of this circle',
      }, { status: 400 });
    }

    // Add user to circle
    const updatedCircle = await db.circle.update({
      where: { id: params.id },
      data: {
        members: [...circle.members, userToInvite.id],
      },
      include: {
        owner: {
          select: {
            id: true,
            handle: true,
            avatarUrl: true,
            verified: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedCircle,
        memberCount: updatedCircle.members.length,
        isOwner: true,
      },
      message: `Successfully invited ${userToInvite.handle} to the circle`,
    });

  } catch (error) {
    console.error('Error inviting user to circle:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to invite user',
    }, { status: 500 });
  }
}
