export default function PostDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the post
  const post = {
    id: params.id,
    title: 'Small Business Expansion Loan',
    description: 'Looking to expand my local bakery with new equipment and hire 2 additional staff members. I\'ve been running this bakery for 3 years and have built a loyal customer base. The expansion will allow me to serve more customers and create jobs in our community.',
    category: 'Business',
    goal: 15000,
    raised: 8500,
    pledgers: 12,
    daysLeft: 23,
    terms: '12 month repayment, 5% interest',
    status: 'active',
    owner: {
      name: 'Sarah Chen',
      handle: 'sarah_chen',
      avatar: null,
      verified: true
    },
    createdAt: '2024-01-15',
    images: []
  };

  const pledges = [
    { id: 1, amount: 500, type: 'donation', pledger: 'John Doe', date: '2024-01-20' },
    { id: 2, amount: 1000, type: 'contract', pledger: 'Jane Smith', date: '2024-01-19' },
    { id: 3, amount: 250, type: 'donation', pledger: 'Mike Johnson', date: '2024-01-18' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                {post.status}
              </span>
              <span className="text-sm text-gray-500">{post.category}</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {post.owner.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{post.owner.name}</span>
                    {post.owner.verified && (
                      <span className="text-blue-600 text-sm">✓ Verified</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">@{post.owner.handle}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              {post.description}
            </p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-900">
                  ${post.raised.toLocaleString()} of ${post.goal.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round((post.raised / post.goal) * 100)}% funded
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${Math.min((post.raised / post.goal) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>{post.pledgers} pledgers</span>
                <span>{post.daysLeft} days left</span>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Terms</h3>
              <p className="text-blue-800">{post.terms}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg">
                Make a Pledge
              </button>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Pledges Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Pledges ({pledges.length})
            </h2>
            
            <div className="space-y-4">
              {pledges.map((pledge) => (
                <div key={pledge.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {pledge.pledger.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{pledge.pledger}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        pledge.type === 'donation' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {pledge.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${pledge.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{pledge.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Comments (0)
            </h2>
            
            <div className="mb-4">
              <textarea
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                  Post Comment
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
