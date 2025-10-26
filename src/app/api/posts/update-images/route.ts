import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// POST /api/posts/update-images - Update post images
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, images } = body;

    if (!postId || !images) {
      return NextResponse.json({
        success: false,
        error: 'Post ID and images are required',
      }, { status: 400 });
    }

    // Update the post with new images
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        images: JSON.stringify(images),
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
        _count: {
          select: {
            pledges: true,
            comments: true,
          },
        },
        pledges: {
          select: {
            amountGLM: true,
          },
        },
      },
    });

    const transformedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      description: updatedPost.description,
      category: updatedPost.category,
      images: JSON.parse(updatedPost.images),
      links: JSON.parse(updatedPost.links),
      acceptContracts: updatedPost.acceptContracts,
      status: updatedPost.status,
      goal: updatedPost.goal,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
      owner: updatedPost.owner,
      pledges: updatedPost.pledges,
      _count: updatedPost._count,
      totalRaised: updatedPost.pledges.reduce((sum, pledge) => sum + pledge.amountGLM, 0),
      pledgeCount: updatedPost._count.pledges,
      commentCount: updatedPost._count.comments,
    };

    return NextResponse.json({
      success: true,
      data: transformedPost,
    });

  } catch (error) {
    console.error('Error updating post images:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update post images',
    }, { status: 500 });
  }
}
