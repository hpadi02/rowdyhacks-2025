export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Fund Your Goals with{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  Trust & Transparency
                </span>
              </h1>
            </div>
            
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Create funding requests with clear terms, receive pledges from your community, 
                and track every transaction transparently. Building trust through accountability.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <a href="/posts/new" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-8 rounded-xl text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl relative overflow-hidden">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a href="/explore" className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-4 px-8 rounded-xl text-lg text-center transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-white/50">
                Explore Requests
              </a>
            </div>

            {/* Key Features with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="group text-center p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Transparent</h3>
                <p className="text-gray-600">Every transaction is recorded and visible to all parties</p>
              </div>

              <div className="group text-center p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Terms</h3>
                <p className="text-gray-600">AI-generated contract templates in plain language</p>
              </div>

              <div className="group text-center p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-gray-600">Support from your trusted community members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works with Animated Cards */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How GoLoanMe Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A transparent platform built on trust, clear agreements, and community support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                title: 'Create Request',
                description: 'Post your funding need with clear terms, timeline, and purpose. Full transparency from the start.',
                gradient: 'from-blue-500 to-cyan-500',
                icon: '📝'
              },
              {
                number: '02',
                title: 'Receive Pledges',
                description: 'Community members review your terms and pledge funds. Every pledge is tracked and visible.',
                gradient: 'from-purple-500 to-pink-500',
                icon: '🤝'
              },
              {
                number: '03',
                title: 'Track Progress',
                description: 'Monitor all transactions in your wallet ledger. Complete visibility for all parties involved.',
                gradient: 'from-green-500 to-emerald-500',
                icon: '📊'
              },
              {
                number: '04',
                title: 'Build Trust',
                description: 'Fulfill your terms, build reputation, and strengthen community relationships over time.',
                gradient: 'from-orange-500 to-red-500',
                icon: '🏆'
              }
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-gray-600">{step.number}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action with Stunning Gradient */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join a community that values transparency, trust, and mutual support
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="group bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-blue-600 font-medium py-4 px-8 rounded-xl text-lg text-center transition-all duration-300 transform hover:scale-105 border border-white/30 hover:border-white">
              <span className="relative z-10">Create Your Account</span>
            </a>
            <a href="/explore" className="group border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 font-medium py-4 px-8 rounded-xl text-lg text-center transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              Browse Requests
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
