import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// POST /api/wallet/add-credits - Add GLM credits to user's wallet
export async function POST(request: NextRequest) {
  try {
    // Temporarily disable auth for testing
    // const session = await getSession();
    // if (!session?.user) {
    //   return NextResponse.json({
    //     success: false,
    //     error: 'Authentication required',
    //   }, { status: 401 });
    // }

    const body = await request.json();
    const { amount, method } = body;
    const userId = 'cmh7gyddo0001pdx0d87gkgfm'; // sam_wilson from seeded data

    if (!amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid amount',
      }, { status: 400 });
    }

    // Find user's account
    let account = await prisma.account.findFirst({
      where: {
        ownerType: 'user',
        ownerId: userId,
      }
    });

    if (!account) {
      // Create account if it doesn't exist
      account = await prisma.account.create({
        data: {
          ownerType: 'user',
          ownerId: userId,
          balanceGLM: 0,
        }
      });
    }

    // Add credits using a transaction
    await prisma.$transaction(async (tx) => {
      // Create ledger entry
      await tx.ledgerEntry.create({
        data: {
          accountId: account.id,
          type: 'credit',
          amountGLM: amount,
          refType: 'credit_purchase',
          refId: `credit_${Date.now()}`,
        }
      });

      // Update balance
      await tx.account.update({
        where: { id: account.id },
        data: { balanceGLM: account.balanceGLM + amount }
      });
    });

    return NextResponse.json({
      success: true,
      message: `Added ${amount} GLM credits to your wallet`,
      newBalance: account.balanceGLM + amount,
    });

  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add credits',
    }, { status: 500 });
  }
}
