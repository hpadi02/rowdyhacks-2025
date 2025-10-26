import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db as prisma } from '@/lib/db';

// GET /api/posts - List posts with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const whereClause: any = {};

    // Apply filters
    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (status) {
      whereClause.status = status;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              handle: true,
              avatarUrl: true,
              verified: true,
            }
          },
          pledges: {
            include: {
              user: {
                select: {
                  id: true,
                  handle: true,
                  avatarUrl: true,
                }
              }
            }
          },
          comments: true,
          _count: {
            select: {
              pledges: true,
              comments: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    // Transform posts to match frontend expectations
    const transformedPosts = posts.map(post => {
      const totalRaised = post.pledges.reduce((sum, pledge) => sum + pledge.amountGLM, 0);
      
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        category: post.category,
        images: JSON.parse(post.images),
        links: JSON.parse(post.links),
        acceptContracts: post.acceptContracts,
        status: post.status,
        goal: post.goal,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        owner: post.owner,
        pledges: post.pledges.map(pledge => ({
          id: pledge.id,
          type: pledge.type,
          amountGLM: pledge.amountGLM,
          note: pledge.note,
          createdAt: pledge.createdAt.toISOString(),
          user: pledge.user,
        })),
        _count: post._count,
        totalRaised,
        pledgeCount: post._count.pledges,
        commentCount: post._count.comments,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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
    const userId = 'test-user-id'; // Mock user ID for now

    const newPost = await prisma.post.create({
      data: {
        ownerId: userId,
        title: body.title,
        description: body.description,
        category: body.category,
        images: JSON.stringify(body.images || []),
        links: JSON.stringify(body.links || []),
        acceptContracts: body.acceptContracts || false,
        status: 'OPEN',
        goal: body.goal,
      },
      include: {
        owner: {
          select: {
            id: true,
            handle: true,
            avatarUrl: true,
            verified: true,
          }
        },
        _count: {
          select: {
            pledges: true,
            comments: true,
          }
        }
      }
    });

    // Create account for the post
    await prisma.account.create({
      data: {
        ownerType: 'post',
        ownerId: newPost.id,
        balanceGLM: 0,
      }
    });

    const transformedPost = {
      id: newPost.id,
      title: newPost.title,
      description: newPost.description,
      category: newPost.category,
      images: JSON.parse(newPost.images),
      links: JSON.parse(newPost.links),
      acceptContracts: newPost.acceptContracts,
      status: newPost.status,
      goal: newPost.goal,
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString(),
      owner: newPost.owner,
      pledges: [],
      _count: newPost._count,
      totalRaised: 0,
      pledgeCount: 0,
      commentCount: 0,
    };

    return NextResponse.json({
      success: true,
      data: transformedPost,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create post',
    }, { status: 500 });
  }
}