import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db as prisma } from '@/lib/db';

// GET /api/wallet - Get user's wallet balance
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
      // Create account if it doesn't exist
      const newAccount = await prisma.account.create({
        data: {
          ownerType: 'user',
          ownerId: userId,
          balanceGLM: 0,
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          balance: newAccount.balanceGLM,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0,
        },
      });
    }

    // Calculate totals from ledger entries
    const ledgerEntries = await prisma.ledgerEntry.findMany({
      where: { accountId: account.id }
    });

    const totalReceived = ledgerEntries
      .filter(entry => entry.type === 'credit')
      .reduce((sum, entry) => sum + entry.amountGLM, 0);

    const totalSent = ledgerEntries
      .filter(entry => entry.type === 'debit')
      .reduce((sum, entry) => sum + entry.amountGLM, 0);

    const walletData = {
      balance: account.balanceGLM,
      totalReceived,
      totalSent,
      transactionCount: ledgerEntries.length,
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