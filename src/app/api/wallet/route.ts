import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

// GET /api/wallet - Get user's wallet balance
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    // Mock wallet data
    const walletData = {
      balance: 1000,
      totalReceived: 1500,
      totalSent: 500,
      transactionCount: 3,
    };

    return NextResponse.json({
      success: true,
      data: walletData,
    });

  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wallet',
    }, { status: 500 });
  }
}