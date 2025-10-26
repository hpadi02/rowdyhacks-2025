import { NextRequest, NextResponse } from 'next/server';
import { generateContract } from '@/lib/openrouter';
import { generatePDF } from '@/lib/pdf-generator';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // For demo purposes, generate a sample contract
    const contractData = await generateContract({
      interestRate: 5,
      repaymentPeriod: '12 months',
      gracePeriod: '30 days',
      collateral: 'Personal guarantee and vehicle title',
      remedies: 'Late fees and collection procedures',
      disclaimers: 'This is a simulated contract for demonstration purposes only',
    });

    // Generate PDF
    const pdfBuffer = await generatePDF(contractData.html, 'Community Funding Contract');

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${params.filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
