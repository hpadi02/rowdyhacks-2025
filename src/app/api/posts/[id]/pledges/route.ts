import { NextRequest, NextResponse } from 'next/server';
import { getMockSession } from '@/lib/mock-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createPledgeSchema = z.object({
  type: z.enum(['DONATION', 'CONTRACT']),
  amountGLM: z.number().positive(),
  termsId: z.string().optional(),
  note: z.string().max(500).optional(),
});

// GET /api/posts/[id]/pledges - List pledges for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
      }, { status: 404 });
    }

    // Get pledges for the post
    const pledges = await db.pledge.findMany({
      where: { postId: params.id },
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
    });

    // Calculate total raised
    const totalRaised = pledges.reduce((sum, pledge) => sum + pledge.amountGLM, 0);

    return NextResponse.json({
      success: true,
      data: {
        pledges,
        totalRaised,
        pledgeCount: pledges.length,
      },
    });

  } catch (error) {
    console.error('Error fetching pledges:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pledges',
    }, { status: 500 });
  }
}

// POST /api/posts/[id]/pledges - Create pledge
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getMockSession(request);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPledgeSchema.parse(body);

    // Get or create user
    let user = await db.user.findUnique({
      where: { auth0Sub: session.user.sub },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          auth0Sub: session.user.sub,
          email: session.user.email || '',
          handle: session.user.nickname || session.user.email?.split('@')[0] || 'user',
          avatarUrl: session.user.picture,
        },
      });
    }

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        ownerId: true, 
        acceptContracts: true,
        status: true,
      },
    });

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
      }, { status: 404 });
    }

    if (post.status !== 'OPEN') {
      return NextResponse.json({
        success: false,
        error: 'Post is not accepting pledges',
      }, { status: 400 });
    }

    // Validate contract pledge requirements
    if (validatedData.type === 'CONTRACT') {
      if (!post.acceptContracts) {
        return NextResponse.json({
          success: false,
          error: 'This post does not accept contract pledges',
        }, { status: 400 });
      }

      if (!validatedData.termsId) {
        return NextResponse.json({
          success: false,
          error: 'Terms template required for contract pledges',
        }, { status: 400 });
      }

      // Verify terms template belongs to user
      const terms = await db.termsTemplate.findUnique({
        where: { id: validatedData.termsId },
        select: { userId: true },
      });

      if (!terms || terms.userId !== user.id) {
        return NextResponse.json({
          success: false,
          error: 'Invalid terms template',
        }, { status: 400 });
      }
    }

    // Get user's account
    let userAccount = await db.account.findFirst({
      where: {
        ownerType: 'USER',
        ownerId: user.id,
      },
    });

    if (!userAccount) {
      userAccount = await db.account.create({
        data: {
          ownerType: 'USER',
          ownerId: user.id,
          balanceGLM: 1000, // Give new users 1000 GLM credits
        },
      });
    }

    // Check if user has sufficient balance
    if (userAccount.balanceGLM < validatedData.amountGLM) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient GLM balance',
      }, { status: 400 });
    }

    // Get post's account
    let postAccount = await db.account.findFirst({
      where: {
        ownerType: 'POST',
        ownerId: post.id,
      },
    });

    if (!postAccount) {
      postAccount = await db.account.create({
        data: {
          ownerType: 'POST',
          ownerId: post.id,
          balanceGLM: 0,
        },
      });
    }

    // Create pledge and update accounts in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create pledge
      const pledge = await tx.pledge.create({
        data: {
          postId: params.id,
          pledgerId: user.id,
          type: validatedData.type,
          amountGLM: validatedData.amountGLM,
          termsId: validatedData.termsId,
          note: validatedData.note,
        },
        include: {
          pledger: {
            select: {
              id: true,
              handle: true,
              avatarUrl: true,
              verified: true,
            },
          },
          terms: validatedData.termsId ? {
            select: {
              id: true,
              title: true,
              pdfUrl: true,
            },
          } : undefined,
        },
      });

      // Update user account (debit)
      await tx.account.update({
        where: { id: userAccount.id },
        data: {
          balanceGLM: userAccount.balanceGLM - validatedData.amountGLM,
        },
      });

      // Update post account (credit)
      await tx.account.update({
        where: { id: postAccount.id },
        data: {
          balanceGLM: postAccount.balanceGLM + validatedData.amountGLM,
        },
      });

      // Create ledger entries
      await tx.ledgerEntry.create({
        data: {
          accountId: userAccount.id,
          type: 'DEBIT',
          amountGLM: validatedData.amountGLM,
          refType: 'PLEDGE',
          refId: pledge.id,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          accountId: postAccount.id,
          type: 'CREDIT',
          amountGLM: validatedData.amountGLM,
          refType: 'PLEDGE',
          refId: pledge.id,
        },
      });

      return pledge;
    });

    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating pledge:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create pledge',
    }, { status: 500 });
  }
}
