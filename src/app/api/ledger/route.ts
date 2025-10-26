import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    type: 'CREDIT',
    amountGLM: 1000,
    refType: 'TRANSFER',
    createdAt: '2025-01-20T00:00:00Z',
    pledge: {
      id: 'pledge1',
      postTitle: 'Welcome Bonus',
      postOwner: 'System',
      pledger: 'System',
      note: 'Initial GLM credits',
    },
  },
  {
    id: '2',
    type: 'DEBIT',
    amountGLM: 200,
    refType: 'PLEDGE',
    createdAt: '2025-01-24T00:00:00Z',
    pledge: {
      id: 'pledge2',
      postTitle: 'Medical Emergency Fund',
      postOwner: 'demo_user',
      pledger: 'demo_user',
      note: 'Contract pledge',
    },
  },
  {
    id: '3',
    type: 'CREDIT',
    amountGLM: 300,
    refType: 'REPAYMENT',
    createdAt: '2025-01-23T00:00:00Z',
    pledge: {
      id: 'pledge3',
      postTitle: 'Education Fund',
      postOwner: 'demo_user',
      pledger: 'demo_user',
      note: 'Repayment received',
    },
  },
];

// GET /api/ledger - Get user's transaction history
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredTransactions = [...mockTransactions];

    if (type) {
      filteredTransactions = filteredTransactions.filter(tx => tx.type === type);
    }

    const skip = (page - 1) * limit;
    const paginatedTransactions = filteredTransactions.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        pages: Math.ceil(filteredTransactions.length / limit),
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