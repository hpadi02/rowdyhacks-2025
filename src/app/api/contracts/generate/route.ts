import { NextRequest, NextResponse } from 'next/server';
import { generateContract } from '@/lib/openrouter';
import { generatePDF } from '@/lib/pdf-generator';
import { uploadPDF } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interestRate, repaymentPeriod, gracePeriod, collateral, remedies, disclaimers } = body;

    // Validate required fields
    if (!interestRate || !repaymentPeriod || !gracePeriod || !collateral || !remedies || !disclaimers) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate contract using AI
    const contractData = await generateContract({
      interestRate: parseFloat(interestRate),
      repaymentPeriod,
      gracePeriod,
      collateral,
      remedies,
      disclaimers,
    });

    // Generate PDF
    const pdfBuffer = await generatePDF(contractData.html, 'Community Funding Contract');

    // Generate filename and create local download URL
    const filename = `contract-${Date.now()}.pdf`;
    const pdfUrl = `/api/contracts/download/${filename}`;

    // Return the contract data and PDF URL
    return NextResponse.json({
      success: true,
      contract: {
        schema: contractData.schema,
        html: contractData.html,
        pdfUrl,
        filename,
      },
    });

  } catch (error) {
    console.error('Error generating contract:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
