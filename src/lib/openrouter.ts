// OpenRouter API integration for AI contract generation

export interface ContractInputs {
  interestRate: number;
  repaymentPeriod: string;
  gracePeriod: string;
  collateral: string;
  remedies: string;
  disclaimers: string;
}

export interface ContractOutput {
  schema: {
    parties: string;
    offer: string;
    consideration: string;
    amount: string;
    repayment: string;
    gracePeriod: string;
    remedies: string;
    collateral: string;
    disclaimers: string;
  };
  html: string;
}

export async function generateContract(inputs: ContractInputs): Promise<ContractOutput> {
  // For demo purposes, we'll use a sophisticated template generator
  // This creates professional-looking contracts without requiring API calls
  
  const contractTemplate = generateContractTemplate(inputs);
  
  return contractTemplate;
}

function generateContractTemplate(inputs: ContractInputs): ContractOutput {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>LOAN AGREEMENT</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
          background: #fff;
          margin: 0;
          padding: 0;
        }
        .document {
          width: 8.5in;
          margin: 0 auto;
          padding: 0.75in;
          border: 2px solid #000;
          background: #fff;
          page-break-inside: avoid;
        }
        .header {
          text-align: center;
          margin-bottom: 0.3in;
        }
        .title {
          font-size: 16pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
          margin-bottom: 0.2in;
        }
        .section {
          margin-bottom: 0.15in;
          text-align: justify;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 0.05in;
        }
        .section-content {
          font-size: 11pt;
          line-height: 1.3;
          text-align: justify;
        }
        .blank-line {
          border-bottom: 1px solid #000;
          display: inline-block;
          min-width: 1.5in;
          margin: 0 0.05in;
          height: 1em;
        }
        .blank-line-short {
          border-bottom: 1px solid #000;
          display: inline-block;
          min-width: 0.4in;
          margin: 0 0.05in;
          height: 1em;
        }
        .blank-line-long {
          border-bottom: 1px solid #000;
          display: inline-block;
          min-width: 2.5in;
          margin: 0 0.05in;
          height: 1em;
        }
        .checkbox {
          display: inline-block;
          width: 0.12in;
          height: 0.12in;
          border: 1px solid #000;
          margin-right: 0.05in;
          vertical-align: middle;
          position: relative;
        }
        .checkbox.checked {
          background-color: #000;
        }
        .checkbox.checked::after {
          content: '✓';
          color: #fff;
          font-size: 7pt;
          position: absolute;
          top: -1px;
          left: 1px;
        }
        .indent {
          margin-left: 0.2in;
        }
        .signature-section {
          margin-top: 0.3in;
          border-top: 1px solid #000;
          padding-top: 0.1in;
        }
        .signature-block {
          margin: 0.1in 0;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          width: 2in;
          height: 1em;
          display: inline-block;
          margin: 0 0.05in;
        }
        .footer {
          margin-top: 0.2in;
          border-top: 1px solid #000;
          padding-top: 0.05in;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9pt;
        }
        .logo {
          font-size: 10pt;
          font-weight: bold;
        }
        .page-number {
          font-size: 9pt;
        }
        p {
          margin-bottom: 0.05in;
        }
        strong {
          font-weight: bold;
        }
        em {
          font-style: italic;
        }
        .compact {
          margin-bottom: 0.1in;
        }
        .compact p {
          margin-bottom: 0.03in;
        }
      </style>
    </head>
    <body>
      <div class="document">
        <div class="header">
          <h1 class="title">LOAN AGREEMENT</h1>
        </div>
        
        <div class="section compact">
          <div class="section-title">I. THE PARTIES</div>
          <div class="section-content">
            <p>THE PARTIES. This Loan Agreement ("Agreement") made this <span class="blank-line"></span> 20<span class="blank-line-short"></span>, is between:</p>
            <p><strong>Borrower:</strong> <span class="blank-line-long"></span> with a mailing address of <span class="blank-line-long"></span> ("Borrower") and</p>
            <p>agrees to borrow money from:</p>
            <p><strong>Lender:</strong> <span class="blank-line-long"></span> with a mailing address of <span class="blank-line-long"></span> and agrees to lend</p>
            <p>money to the Borrower under the following terms:</p>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">II. LOAN AMOUNT</div>
          <div class="section-content">
            <p>LOAN AMOUNT. The total amount of money being borrowed from the Lender to the Borrower is $<span class="blank-line-long"></span> ("Borrowed Money").</p>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">III. INTEREST RATE</div>
          <div class="section-content">
            <p>INTEREST RATE. The Borrowed Money shall: (check one)</p>
            <p><span class="checkbox checked"></span> - Bear Interest. The Borrowed Money shall bear interest at a rate of <span class="blank-line"></span>% compounded: (check one)</p>
            <div class="indent">
              <p><span class="checkbox"></span> - Annually</p>
              <p><span class="checkbox checked"></span> - Monthly</p>
              <p><span class="checkbox"></span> - Other: <span class="blank-line"></span></p>
            </div>
            <p><span class="checkbox"></span> - NOT Bear Interest. There shall be no interest associated with the Borrowed Money. The Borrower's only obligation to the Lender is to repay the principal balance.</p>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">IV. TERM</div>
          <div class="section-content">
            <p>TERM. The total amount of the Borrowed Money, including principal and interest, shall be due and payable on <span class="blank-line"></span> 20<span class="blank-line-short"></span> ("Due Date").</p>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">V. PAYMENTS</div>
          <div class="section-content">
            <p>PAYMENTS. The Borrower agrees to repay the Borrowed Money to the Lender under the following payment schedule: (check one)</p>
            <p><span class="checkbox"></span> - Weekly Payments. The Borrower agrees to repay the Lender a payment of $<span class="blank-line"></span> on the <span class="blank-line"></span> of each week until the Due Date.</p>
            <p><span class="checkbox checked"></span> - Monthly Payments. The Borrower agrees to repay the Lender a payment of $<span class="blank-line"></span> on the <span class="blank-line"></span> of each month until the Due Date.</p>
            <p><span class="checkbox"></span> - Lump Sum. The Borrower agrees to repay the Lender, in full, on the Due Date.</p>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">VI. COLLATERAL AND SECURITY</div>
          <div class="section-content">
            <p>COLLATERAL. To secure the performance of this Agreement, the Borrower provides the following collateral:</p>
            <p><span class="blank-line-long"></span></p>
            <p><em>${inputs.collateral}</em></p>
            <p>The Borrower acknowledges that failure to maintain the agreed-upon collateral may result in immediate acceleration of the loan.</p>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">VII. DEFAULT AND REMEDIES</div>
          <div class="section-content">
            <p>DEFAULT. The Borrower shall be in default under this Agreement upon:</p>
            <div class="indent">
              <p>a) Failure to make any payment when due</p>
              <p>b) Breach of any covenant or condition of this Agreement</p>
              <p>c) Filing of bankruptcy or insolvency proceedings</p>
            </div>
            <p>REMEDIES. Upon default, the Lender may:</p>
            <div class="indent">
              <p>a) Declare the entire outstanding balance immediately due and payable</p>
              <p>b) Pursue all available legal remedies</p>
              <p>c) ${inputs.remedies}</p>
            </div>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">VIII. COMMUNITY PLATFORM TERMS</div>
          <div class="section-content">
            <p>PLATFORM. Both parties acknowledge that this agreement is facilitated through the GoLoanMe community platform and agree to:</p>
            <div class="indent">
              <p>a) Maintain transparency in all transactions</p>
              <p>b) Record all payments on the platform's ledger system</p>
              <p>c) Resolve disputes through the platform's community process</p>
            </div>
          </div>
        </div>
        
        <div class="section compact">
          <div class="section-title">IX. LEGAL DISCLAIMERS</div>
          <div class="section-content">
            <p><strong>DEMONSTRATION PURPOSES ONLY:</strong> This contract is generated for demonstration and educational purposes only. It is not legally binding and should not be used for actual financial transactions.</p>
            <p>${inputs.disclaimers}</p>
          </div>
        </div>
        
        <div class="signature-section">
          <div class="section-title">X. SIGNATURES</div>
          <div class="section-content">
            <p>By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms of this Agreement.</p>
            <div class="signature-block">
              <p><strong>BORROWER:</strong></p>
              <p>Signature: <span class="signature-line"></span> Date: <span class="signature-line"></span></p>
              <p>Print Name: <span class="signature-line"></span></p>
            </div>
            <div class="signature-block">
              <p><strong>LENDER:</strong></p>
              <p>Signature: <span class="signature-line"></span> Date: <span class="signature-line"></span></p>
              <p>Print Name: <span class="signature-line"></span></p>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="logo">e</div>
          <div class="page-number">Page 1 of 1</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    schema: {
      parties: 'Borrower and Lender',
      offer: `Community funding agreement with ${inputs.interestRate}% interest`,
      consideration: 'Mutual agreement to specified terms and conditions',
      amount: 'Amount to be determined by funding request',
      repayment: `Monthly payments over ${inputs.repaymentPeriod}`,
      gracePeriod: inputs.gracePeriod,
      remedies: inputs.remedies,
      collateral: inputs.collateral,
      disclaimers: inputs.disclaimers,
    },
    html
  };
}
