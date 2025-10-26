import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db } from '@/lib/db';
import { z } from 'zod';

const updatePostSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  category: z.enum(['MEDICAL', 'FUNERAL', 'FOR_FUN', 'VET_BILLS', 'EDUCATION', 'COMMUNITY_PROJECTS', 'OTHER']).optional(),
  images: z.array(z.string().url()).optional(),
  links: z.array(z.string().url()).optional(),
  acceptContracts: z.boolean().optional(),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
  goal: z.number().positive().optional(),
});

// GET /api/posts/[id] - Get post details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.post.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            handle: true,
            avatarUrl: true,
            verified: true,
            bio: true,
          },
        },
        pledges: {
          include: {
            pledger: {
              select: {
                id: true,
                handle: true,
                avatarUrl: true,
                verified: true,
              },
            },
            terms: {
              select: {
                id: true,
                title: true,
                pdfUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                handle: true,
                avatarUrl: true,
                verified: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        mentions: {
          include: {
            targetUser: {
              select: {
                id: true,
                handle: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            pledges: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
      }, { status: 404 });
    }

    // Calculate total raised
    const totalRaised = post.pledges.reduce((sum, pledge) => sum + pledge.amountGLM, 0);
    const progressPercentage = post.goal ? Math.min((totalRaised / post.goal) * 100, 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        totalRaised,
        progressPercentage,
        pledgeCount: post._count.pledges,
        commentCount: post._count.comments,
      },
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch post',
    }, { status: 500 });
  }
}

// PATCH /api/posts/[id] - Update post (owner only)
export async function PATCH(
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
    const validatedData = updatePostSchema.parse(body);

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

    // Check if user owns the post
    const existingPost = await db.post.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!existingPost) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
      }, { status: 404 });
    }

    if (existingPost.ownerId !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Not authorized to update this post',
      }, { status: 403 });
    }

    // Update post
    const updatedPost = await db.post.update({
      where: { id: params.id },
      data: validatedData,
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
      data: updatedPost,
    });

  } catch (error) {
    console.error('Error updating post:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update post',
    }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete post (owner or admin)
export async function DELETE(
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

    // Check if post exists and user owns it
    const post = await db.post.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
      }, { status: 404 });
    }

    if (post.ownerId !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Not authorized to delete this post',
      }, { status: 403 });
    }

    // Delete post (cascade will handle related records)
    await db.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete post',
    }, { status: 500 });
  }
}
