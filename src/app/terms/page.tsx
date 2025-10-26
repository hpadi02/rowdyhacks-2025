'use client';

import { useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';

// Add custom styles for contract preview
const contractPreviewStyles = `
  .contract-preview .document {
    margin: 0 auto !important;
    max-width: 8.5in !important;
    width: 100% !important;
    padding: 0.75in !important;
    border: 2px solid #000 !important;
    background: #fff !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  }
  .contract-preview * {
    box-sizing: border-box !important;
  }
`;

interface ContractFormData {
  interestRate: string;
  repaymentPeriod: string;
  gracePeriod: string;
  collateral: string;
  remedies: string;
  disclaimers: string;
}

export default function TermsWizard() {
  // Temporarily disable Auth0 for testing
  const user = { sub: 'test-user' }; // Mock user for testing
  const isLoading = false;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContractFormData>({
    interestRate: '5',
    repaymentPeriod: '12 months',
    gracePeriod: '30 days',
    collateral: 'Personal guarantee',
    remedies: 'Late fees and collection procedures',
    disclaimers: 'This is a simulated contract for demonstration purposes only',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ContractFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate contract');
      }

      const result = await response.json();
      setGeneratedContract(result.contract);
      setCurrentStep(5); // Show results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to create contract templates.</p>
          <a
            href="/api/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: contractPreviewStyles }} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Contract Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create professional contract templates with AI assistance
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Terms</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repayment Period
                  </label>
                  <select
                    value={formData.repaymentPeriod}
                    onChange={(e) => handleInputChange('repaymentPeriod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="18 months">18 months</option>
                    <option value="24 months">24 months</option>
                    <option value="36 months">36 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grace Period
                  </label>
                  <select
                    value={formData.gracePeriod}
                    onChange={(e) => handleInputChange('gracePeriod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7 days">7 days</option>
                    <option value="15 days">15 days</option>
                    <option value="30 days">30 days</option>
                    <option value="60 days">60 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Collateral & Security</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collateral Description
                  </label>
                  <textarea
                    value={formData.collateral}
                    onChange={(e) => handleInputChange('collateral', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the collateral or security for this loan..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Remedies & Enforcement</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remedies for Default
                  </label>
                  <textarea
                    value={formData.remedies}
                    onChange={(e) => handleInputChange('remedies', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe remedies for default..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimers & Legal</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Disclaimers
                  </label>
                  <textarea
                    value={formData.disclaimers}
                    onChange={(e) => handleInputChange('disclaimers', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any legal disclaimers..."
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> This is a simulated contract for demonstration purposes only. 
                    It is not legally binding and should not be used for actual financial transactions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && generatedContract && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Contract</h2>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    ✅ Contract generated successfully! Your PDF is ready for download.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Preview</h3>
                  <div className="flex justify-center">
                    <div 
                      className="contract-preview"
                      style={{ 
                        maxWidth: '100%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                      dangerouslySetInnerHTML={{ __html: generatedContract.html }}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <a
                    href={generatedContract.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
                  >
                    📄 Download PDF
                  </a>
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setGeneratedContract(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleGenerateContract}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    'Generate Contract'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}