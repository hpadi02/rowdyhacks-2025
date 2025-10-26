export default function ExplorePage() {
  const mockPosts = [
    {
      id: '1',
      title: 'Small Business Expansion Loan',
      description: 'Looking to expand my local bakery with new equipment and hire 2 additional staff members.',
      category: 'Business',
      goal: 15000,
      raised: 8500,
      pledgers: 12,
      daysLeft: 23,
      terms: '12 month repayment, 5% interest',
      status: 'active',
      owner: {
        name: 'Sarah Chen',
        avatar: null
      }
    },
    {
      id: '2',
      title: 'Medical Emergency Fund',
      description: 'Unexpected medical expenses for my father\'s surgery. Any help would be greatly appreciated.',
      category: 'Medical',
      goal: 5000,
      raised: 4200,
      pledgers: 28,
      daysLeft: 8,
      terms: 'Gift-based, no repayment required',
      status: 'active',
      owner: {
        name: 'Michael Rodriguez',
        avatar: null
      }
    },
    {
      id: '3',
      title: 'Education Fund for Coding Bootcamp',
      description: 'Seeking support to attend a 6-month coding bootcamp to transition into tech career.',
      category: 'Education',
      goal: 8000,
      raised: 2400,
      pledgers: 8,
      daysLeft: 45,
      terms: 'Repay 50% within 18 months of employment',
      status: 'active',
      owner: {
        name: 'Emily Watson',
        avatar: null
      }
    },
    {
      id: '4',
      title: 'Community Garden Project',
      description: 'Building a community garden in our neighborhood to provide fresh produce for local families.',
      category: 'Community',
      goal: 3000,
      raised: 3000,
      pledgers: 45,
      daysLeft: 0,
      terms: 'Community project, no repayment',
      status: 'funded',
      owner: {
        name: 'David Park',
        avatar: null
      }
    },
    {
      id: '5',
      title: 'Vehicle Repair for Work Commute',
      description: 'My car broke down and I need it repaired to get to work. Single parent with two kids.',
      category: 'Personal',
      goal: 2500,
      raised: 1800,
      pledgers: 15,
      daysLeft: 12,
      terms: '6 month repayment plan',
      status: 'active',
      owner: {
        name: 'Jennifer Martinez',
        avatar: null
      }
    },
    {
      id: '6',
      title: 'Art Studio Equipment',
      description: 'Purchasing professional equipment to start offering art classes to underprivileged youth.',
      category: 'Creative',
      goal: 4500,
      raised: 1200,
      pledgers: 6,
      daysLeft: 30,
      terms: 'Revenue sharing: 10% of class fees for 12 months',
      status: 'active',
      owner: {
        name: 'Alex Thompson',
        avatar: null
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Funding Requests
          </h1>
          <p className="text-gray-600">
            Discover opportunities to support your community. Every request includes clear terms and transparent tracking.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {/* Status Badge */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full animate-pulse ${
                    post.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {post.status}
                  </span>
                  <span className="text-sm text-gray-500">{post.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${post.raised.toLocaleString()} of ${post.goal.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round((post.raised / post.goal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                        post.status === 'funded' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${Math.min((post.raised / post.goal) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{post.pledgers} pledgers</span>
                  {post.daysLeft > 0 && (
                    <span>{post.daysLeft} days left</span>
                  )}
                </div>

                {/* Terms */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Terms:</span> {post.terms}
                  </p>
                </div>

                {/* Owner */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {post.owner.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{post.owner.name}</span>
                </div>

                {/* Action Button */}
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  post.status === 'funded'
                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}>
                  {post.status === 'funded' ? 'View Details' : 'View & Pledge'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Have a funding need?
            </h3>
            <p className="text-gray-600 mb-6">
              Create your own request with clear terms and start receiving support from the community
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg">
              Create Funding Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}