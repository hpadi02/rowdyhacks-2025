import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// POST /api/wallet/transfer - Transfer GLM to another user
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
    const { toUser, amount, note } = body;
    const fromUserId = 'cmh7gyddo0001pdx0d87gkgfm'; // sam_wilson from seeded data

    if (!toUser || !amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transfer data',
      }, { status: 400 });
    }

    // Find sender's account
    let fromAccount = await prisma.account.findFirst({
      where: {
        ownerType: 'user',
        ownerId: fromUserId,
      }
    });

    if (!fromAccount) {
      return NextResponse.json({
        success: false,
        error: 'Sender account not found',
      }, { status: 404 });
    }

    // Check if sender has sufficient balance
    if (fromAccount.balanceGLM < amount) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient balance',
      }, { status: 400 });
    }

    // Find recipient by handle (for demo, we'll use a mock lookup)
    // In production, you'd look up the user by handle and get their account
    const recipientUserId = 'cmh7gyddo0002pdx0smnfhd9d'; // carmen_rodriguez for demo

    let toAccount = await prisma.account.findFirst({
      where: {
        ownerType: 'user',
        ownerId: recipientUserId,
      }
    });

    if (!toAccount) {
      // Create account for recipient if it doesn't exist
      toAccount = await prisma.account.create({
        data: {
          ownerType: 'user',
          ownerId: recipientUserId,
          balanceGLM: 0,
        }
      });
    }

    // Perform the transfer using a transaction
    await prisma.$transaction(async (tx) => {
      // Debit sender's account
      await tx.ledgerEntry.create({
        data: {
          accountId: fromAccount.id,
          type: 'debit',
          amountGLM: amount,
          refType: 'transfer',
          refId: `transfer_${Date.now()}`,
        }
      });

      // Credit recipient's account
      await tx.ledgerEntry.create({
        data: {
          accountId: toAccount.id,
          type: 'credit',
          amountGLM: amount,
          refType: 'transfer',
          refId: `transfer_${Date.now()}`,
        }
      });

      // Update balances
      await tx.account.update({
        where: { id: fromAccount.id },
        data: { balanceGLM: fromAccount.balanceGLM - amount }
      });

      await tx.account.update({
        where: { id: toAccount.id },
        data: { balanceGLM: toAccount.balanceGLM + amount }
      });
    });

    return NextResponse.json({
      success: true,
      message: `Transferred ${amount} GLM to @${toUser}`,
    });

  } catch (error) {
    console.error('Error transferring GLM:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to transfer GLM',
    }, { status: 500 });
  }
}
