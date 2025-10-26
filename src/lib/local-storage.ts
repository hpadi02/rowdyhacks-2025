// Local storage utilities for hackathon mode
// This replaces database calls with browser localStorage

export interface LocalStorageData {
  posts: any[];
  circles: any[];
  wallet: {
    balance: number;
    transactions: any[];
  };
  terms: any[];
}

const STORAGE_KEY = 'goloanme-data';

export const getLocalData = (): LocalStorageData => {
  if (typeof window === 'undefined') {
    return {
      posts: [],
      circles: [],
      wallet: { balance: 1000, transactions: [] },
      terms: []
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  // Initialize with demo data
  const initialData: LocalStorageData = {
    posts: [
      {
        id: '1',
        title: 'Help with Medical Bills',
        description: 'I need $500 for my daughter\'s surgery. Any help would be greatly appreciated.',
        category: 'Medical',
        images: ['/images/medical.png'],
        links: [],
        acceptContracts: true,
        status: 'open',
        goal: 500,
        totalRaised: 250,
        owner: {
          id: 'user1',
          handle: 'carmen_rodriguez',
          avatarUrl: null,
          verified: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pledges: [],
        _count: { pledges: 2, comments: 3 },
        pledgeCount: 2,
        commentCount: 3,
      },
      {
        id: '2',
        title: 'Small Business Expansion',
        description: 'Looking to expand my local bakery with new equipment and hire 2 additional staff members.',
        category: 'Other',
        images: ['/images/smallbusiness.png'],
        links: ['https://example.com/business-plan'],
        acceptContracts: true,
        status: 'open',
        goal: 15000,
        totalRaised: 5000,
        owner: {
          id: 'user2',
          handle: 'sam_wilson',
          avatarUrl: null,
          verified: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pledges: [],
        _count: { pledges: 5, comments: 8 },
        pledgeCount: 5,
        commentCount: 8,
      },
      {
        id: '3',
        title: 'Community Garden Project',
        description: 'Building a community garden in our neighborhood to provide fresh produce for local families.',
        category: 'Community Projects',
        images: ['/images/garden.png'],
        links: [],
        acceptContracts: false,
        status: 'open',
        goal: 3000,
        totalRaised: 1200,
        owner: {
          id: 'user3',
          handle: 'sofia_martinez',
          avatarUrl: null,
          verified: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pledges: [],
        _count: { pledges: 3, comments: 5 },
        pledgeCount: 3,
        commentCount: 5,
      },
    ],
    circles: [
      {
        id: '1',
        name: 'Tech Entrepreneurs',
        description: 'Supporting fellow tech entrepreneurs and startups',
        memberCount: 12,
        isOwner: true,
        owner: {
          id: 'user1',
          handle: 'demo_user',
          avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
          verified: true,
        },
        createdAt: '2025-01-20T00:00:00Z',
      },
    ],
    wallet: {
      balance: 1000,
      transactions: [
        {
          id: '1',
          type: 'CREDIT',
          amountGLM: 1000,
          refType: 'INITIAL',
          createdAt: new Date().toISOString(),
        },
      ],
    },
    terms: [],
  };

  setLocalData(initialData);
  return initialData;
};

export const setLocalData = (data: LocalStorageData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const addPost = (post: any): void => {
  const data = getLocalData();
  data.posts.unshift(post);
  setLocalData(data);
};

export const addCircle = (circle: any): void => {
  const data = getLocalData();
  data.circles.unshift(circle);
  setLocalData(data);
};

export const addTransaction = (transaction: any): void => {
  const data = getLocalData();
  data.wallet.transactions.unshift(transaction);
  data.wallet.balance += transaction.type === 'CREDIT' ? transaction.amountGLM : -transaction.amountGLM;
  setLocalData(data);
  
  // Enhanced console logging for transactions
  console.log('💳 Transaction Processed:', {
    transactionId: transaction.id,
    type: transaction.type,
    amount: transaction.amountGLM,
    refType: transaction.refType,
    refId: transaction.refId,
    timestamp: transaction.createdAt,
    newBalance: data.wallet.balance,
    note: transaction.note
  });
  
  console.log('📊 Wallet Status:', {
    balance: data.wallet.balance,
    transactionCount: data.wallet.transactions.length,
    lastTransaction: transaction
  });
};

export const addTerms = (terms: any): void => {
  const data = getLocalData();
  data.terms.unshift(terms);
  setLocalData(data);
};
