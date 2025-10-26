import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db as prisma } from '@/lib/db';

// GET /api/ledger - Get user's transaction history
export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth for testing
    // const session = await getSession();
    // if (!session?.user) {
    //   return NextResponse.json({
    //     success: false,
    //     error: 'Authentication required',
    //   }, { status: 401 });
    // }

    const userId = 'cmh7gyddo0001pdx0d87gkgfm'; // sam_wilson from seeded data

    // Find user's account
    const account = await prisma.account.findFirst({
      where: {
        ownerType: 'user',
        ownerId: userId,
      }
    });

    if (!account) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const whereClause: any = { accountId: account.id };
    if (type) {
      whereClause.type = type.toUpperCase();
    }

    const [transactions, total] = await Promise.all([
      prisma.ledgerEntry.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ledgerEntry.count({ where: whereClause }),
    ]);

    // Transform transactions to match frontend expectations
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      amountGLM: transaction.amountGLM,
      refType: transaction.refType,
      createdAt: transaction.createdAt.toISOString(),
      // For now, we'll add mock pledge data since the relation is complex
      pledge: transaction.refType === 'PLEDGE' ? {
        id: transaction.refId || 'unknown',
        postTitle: 'Sample Post',
        postOwner: 'Sample Owner',
        pledger: 'Sample Pledger',
        note: 'Transaction note',
      } : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: transformedTransactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching ledger:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch ledger',
    }, { status: 500 });
  }
}