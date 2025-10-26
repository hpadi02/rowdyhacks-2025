// Mock database for development when MongoDB is not accessible
// This will allow the app to work while we fix the database connection

export interface MockUser {
  id: string;
  auth0Sub: string;
  email: string;
  handle: string;
  bio?: string;
  avatarUrl?: string;
  locale: 'EN' | 'ES';
  interests: string[];
  verified: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockPost {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: 'MEDICAL' | 'FUNERAL' | 'FOR_FUN' | 'VET_BILLS' | 'EDUCATION' | 'COMMUNITY_PROJECTS' | 'OTHER';
  images: string[];
  links: string[];
  acceptContracts: boolean;
  status: 'OPEN' | 'CLOSED';
  goal?: number;
  createdAt: string;
  updatedAt: string;
  owner: MockUser;
  pledges: MockPledge[];
  _count: {
    pledges: number;
    comments: number;
  };
}

export interface MockPledge {
  id: string;
  postId: string;
  pledgerId: string;
  type: 'DONATION' | 'CONTRACT';
  amountGLM: number;
  termsId?: string;
  note?: string;
  createdAt: string;
  pledger: MockUser;
  terms?: {
    id: string;
    title: string;
    pdfUrl?: string;
  };
}

export interface MockCircle {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: string;
  owner: MockUser;
  memberCount: number;
  isOwner: boolean;
}

export interface MockAccount {
  id: string;
  ownerType: 'USER' | 'POST';
  ownerId: string;
  balanceGLM: number;
}

export interface MockLedgerEntry {
  id: string;
  accountId: string;
  type: 'CREDIT' | 'DEBIT';
  amountGLM: number;
  refType: 'PLEDGE' | 'TRANSFER' | 'REPAYMENT';
  refId: string;
  createdAt: string;
  pledge?: {
    id: string;
    postTitle: string;
    postOwner: string;
    pledger: string;
    note?: string;
  };
}

// Mock data
const mockUsers: MockUser[] = [
  {
    id: 'user1',
    auth0Sub: 'auth0|test-user-1',
    email: 'demo@example.com',
    handle: 'demo_user',
    bio: 'Demo user for testing',
    avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
    locale: 'EN',
    interests: ['Technology', 'Education'],
    verified: true,
    rating: 4.8,
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
  },
];

const mockPosts: MockPost[] = [
  {
    id: 'post1',
    ownerId: 'user1',
    title: 'Medical Emergency Fund',
    description: 'Need help with unexpected medical expenses for my father\'s surgery. Any support would be greatly appreciated.',
    category: 'MEDICAL',
    images: [],
    links: [],
    acceptContracts: true,
    status: 'OPEN',
    goal: 5000,
    createdAt: '2025-01-25T00:00:00Z',
    updatedAt: '2025-01-25T00:00:00Z',
    owner: mockUsers[0],
    pledges: [],
    _count: {
      pledges: 0,
      comments: 0,
    },
  },
  {
    id: 'post2',
    ownerId: 'user1',
    title: 'Education Fund for Coding Bootcamp',
    description: 'Seeking support to attend a 6-month coding bootcamp to transition into tech career.',
    category: 'EDUCATION',
    images: [],
    links: [],
    acceptContracts: false,
    status: 'OPEN',
    goal: 8000,
    createdAt: '2025-01-24T00:00:00Z',
    updatedAt: '2025-01-24T00:00:00Z',
    owner: mockUsers[0],
    pledges: [],
    _count: {
      pledges: 0,
      comments: 0,
    },
  },
];

const mockCircles: MockCircle[] = [
  {
    id: 'circle1',
    ownerId: 'user1',
    name: 'Tech Entrepreneurs',
    description: 'Supporting fellow tech entrepreneurs and startups',
    members: ['user1'],
    createdAt: '2025-01-20T00:00:00Z',
    owner: mockUsers[0],
    memberCount: 1,
    isOwner: true,
  },
];

const mockAccounts: MockAccount[] = [
  {
    id: 'account1',
    ownerType: 'USER',
    ownerId: 'user1',
    balanceGLM: 1000,
  },
];

const mockLedgerEntries: MockLedgerEntry[] = [
  {
    id: 'ledger1',
    accountId: 'account1',
    type: 'CREDIT',
    amountGLM: 1000,
    refType: 'TRANSFER',
    refId: 'welcome',
    createdAt: '2025-01-20T00:00:00Z',
  },
];

// Mock database functions
export class MockDB {
  // Users
  static async findUserByAuth0Sub(auth0Sub: string): Promise<MockUser | null> {
    return mockUsers.find(user => user.auth0Sub === auth0Sub) || null;
  }

  static async createUser(userData: Partial<MockUser>): Promise<MockUser> {
    const newUser: MockUser = {
      id: `user${Date.now()}`,
      auth0Sub: userData.auth0Sub || '',
      email: userData.email || '',
      handle: userData.handle || 'user',
      bio: userData.bio,
      avatarUrl: userData.avatarUrl,
      locale: userData.locale || 'EN',
      interests: userData.interests || [],
      verified: userData.verified || false,
      rating: userData.rating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  // Posts
  static async findPosts(where: any = {}, include: any = {}): Promise<MockPost[]> {
    return mockPosts.map(post => ({
      ...post,
      totalRaised: post.pledges.reduce((sum, pledge) => sum + pledge.amountGLM, 0),
      pledgeCount: post._count.pledges,
      commentCount: post._count.comments,
    }));
  }

  static async createPost(postData: any): Promise<MockPost> {
    const newPost: MockPost = {
      id: `post${Date.now()}`,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: mockUsers[0],
      pledges: [],
      _count: {
        pledges: 0,
        comments: 0,
      },
    };
    mockPosts.push(newPost);
    return newPost;
  }

  // Circles
  static async findCircles(where: any = {}): Promise<MockCircle[]> {
    return mockCircles;
  }

  static async createCircle(circleData: any): Promise<MockCircle> {
    const newCircle: MockCircle = {
      id: `circle${Date.now()}`,
      ...circleData,
      members: [circleData.ownerId],
      createdAt: new Date().toISOString(),
      owner: mockUsers[0],
      memberCount: 1,
      isOwner: true,
    };
    mockCircles.push(newCircle);
    return newCircle;
  }

  // Accounts
  static async findAccount(where: any): Promise<MockAccount | null> {
    return mockAccounts.find(account => 
      Object.keys(where).every(key => account[key as keyof MockAccount] === where[key])
    ) || null;
  }

  static async createAccount(accountData: any): Promise<MockAccount> {
    const newAccount: MockAccount = {
      id: `account${Date.now()}`,
      ...accountData,
    };
    mockAccounts.push(newAccount);
    return newAccount;
  }

  // Ledger
  static async findLedgerEntries(where: any = {}): Promise<MockLedgerEntry[]> {
    return mockLedgerEntries;
  }

  // Count functions
  static async count(collection: string, where: any = {}): Promise<number> {
    switch (collection) {
      case 'post':
        return mockPosts.length;
      case 'user':
        return mockUsers.length;
      default:
        return 0;
    }
  }
}
