import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        auth0Sub: 'auth0|demo_user_1',
        email: 'carmen@example.com',
        handle: 'carmen_rodriguez',
        bio: 'Community organizer passionate about helping families in need.',
        avatarUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=CR',
        locale: 'EN',
        interests: JSON.stringify(['Community', 'Education', 'Healthcare']),
        verified: false,
        rating: 4.8,
      },
    }),
    prisma.user.create({
      data: {
        auth0Sub: 'auth0|demo_user_2',
        email: 'sam@example.com',
        handle: 'sam_wilson',
        bio: 'Tech professional who believes in supporting local communities.',
        avatarUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=SW',
        locale: 'EN',
        interests: JSON.stringify(['Technology', 'Education', 'Business']),
        verified: true,
        rating: 4.9,
      },
    }),
    prisma.user.create({
      data: {
        auth0Sub: 'auth0|demo_user_3',
        email: 'sofia@example.com',
        handle: 'sofia_martinez',
        bio: 'Verified sponsor with a track record of successful community investments.',
        avatarUrl: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=SM',
        locale: 'ES',
        interests: JSON.stringify(['Business', 'Healthcare', 'Community']),
        verified: true,
        rating: 5.0,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create accounts for users
  const userAccounts = await Promise.all(
    users.map((user) =>
      prisma.account.create({
        data: {
          ownerType: 'USER',
          ownerId: user.id,
          balanceGLM: Math.floor(Math.random() * 5000) + 1000, // Random balance between 1000-6000
        },
      })
    )
  );

  console.log(`✅ Created ${userAccounts.length} user accounts`);

  // Create demo posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        ownerId: users[0].id, // Carmen's post
        title: 'Help with Medical Bills',
        description: 'I need $500 for my daughter\'s surgery. Any help would be greatly appreciated. This is a genuine need and I\'m committed to repaying any assistance.',
        category: 'MEDICAL',
        images: JSON.stringify(['https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Medical+Need']),
        links: JSON.stringify([]),
        acceptContracts: true,
        status: 'OPEN',
        goal: 500,
      },
    }),
    prisma.post.create({
      data: {
        ownerId: users[1].id, // Sam's post
        title: 'Small Business Expansion',
        description: 'Looking to expand my local bakery with new equipment and hire 2 additional staff members. This will create jobs and serve more customers.',
        category: 'OTHER',
        images: JSON.stringify(['https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Business+Growth']),
        links: JSON.stringify(['https://example.com/business-plan']),
        acceptContracts: true,
        status: 'OPEN',
        goal: 15000,
      },
    }),
    prisma.post.create({
      data: {
        ownerId: users[2].id, // Sofia's post
        title: 'Community Garden Project',
        description: 'Building a community garden in our neighborhood to provide fresh produce for local families. This is a community project with no repayment required.',
        category: 'COMMUNITY_PROJECTS',
        images: JSON.stringify(['https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Community+Garden']),
        links: JSON.stringify([]),
        acceptContracts: false,
        status: 'OPEN',
        goal: 3000,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Create accounts for posts
  const postAccounts = await Promise.all(
    posts.map((post) =>
      prisma.account.create({
        data: {
          ownerType: 'POST',
          ownerId: post.id,
          balanceGLM: 0,
        },
      })
    )
  );

  console.log(`✅ Created ${postAccounts.length} post accounts`);

  // Create demo pledges
  const pledges = await Promise.all([
    prisma.pledge.create({
      data: {
        postId: posts[0].id, // Carmen's medical post
        pledgerId: users[1].id, // Sam pledges
        type: 'DONATION',
        amountGLM: 100,
        note: 'Happy to help with your daughter\'s surgery. Wishing you all the best!',
      },
    }),
    prisma.pledge.create({
      data: {
        postId: posts[0].id, // Carmen's medical post
        pledgerId: users[2].id, // Sofia pledges
        type: 'CONTRACT',
        amountGLM: 400,
        note: 'I\'ll help with the remaining amount. Let\'s discuss terms.',
      },
    }),
    prisma.pledge.create({
      data: {
        postId: posts[1].id, // Sam's business post
        pledgerId: users[2].id, // Sofia pledges
        type: 'CONTRACT',
        amountGLM: 5000,
        note: 'Great business idea! I\'d like to discuss investment terms.',
      },
    }),
  ]);

  console.log(`✅ Created ${pledges.length} pledges`);

  // Create ledger entries for pledges
  const ledgerEntries = [];
  
  for (const pledge of pledges) {
    // Debit from pledger's account
    const pledgerAccount = userAccounts.find(acc => acc.ownerId === pledge.pledgerId);
    if (pledgerAccount) {
      ledgerEntries.push(
        prisma.ledgerEntry.create({
          data: {
            accountId: pledgerAccount.id,
            type: 'DEBIT',
            amountGLM: pledge.amountGLM,
            refType: 'PLEDGE',
            refId: pledge.id,
          },
        })
      );
    }

    // Credit to post's account
    const postAccount = postAccounts.find(acc => acc.ownerId === pledge.postId);
    if (postAccount) {
      ledgerEntries.push(
        prisma.ledgerEntry.create({
          data: {
            accountId: postAccount.id,
            type: 'CREDIT',
            amountGLM: pledge.amountGLM,
            refType: 'PLEDGE',
            refId: pledge.id,
          },
        })
      );
    }
  }

  await Promise.all(ledgerEntries);
  console.log(`✅ Created ${ledgerEntries.length} ledger entries`);

  // Create demo circles
  const circles = await Promise.all([
    prisma.circle.create({
      data: {
        ownerId: users[2].id, // Sofia creates a circle
        name: 'Local Business Supporters',
        members: JSON.stringify([users[0].id, users[1].id]), // Carmen and Sam are members
      },
    }),
  ]);

  console.log(`✅ Created ${circles.length} circles`);

  // Create demo comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        postId: posts[0].id, // Carmen's medical post
        authorId: users[1].id, // Sam comments
        text: 'I hope your daughter gets better soon! Happy to help.',
      },
    }),
    prisma.comment.create({
      data: {
        postId: posts[1].id, // Sam's business post
        authorId: users[2].id, // Sofia comments
        text: 'This sounds like a great opportunity! I\'d love to learn more about your business plan.',
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} comments`);

  // Create demo mentions
  const mentions = await Promise.all([
    prisma.mention.create({
      data: {
        postId: posts[0].id, // Carmen's medical post
        authorId: users[0].id, // Carmen mentions
        targetUserId: users[1].id, // Sam
      },
    }),
  ]);

  console.log(`✅ Created ${mentions.length} mentions`);

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${users.length} users created`);
  console.log(`- ${posts.length} posts created`);
  console.log(`- ${pledges.length} pledges created`);
  console.log(`- ${ledgerEntries.length} ledger entries created`);
  console.log(`- ${circles.length} circles created`);
  console.log(`- ${comments.length} comments created`);
  console.log(`- ${mentions.length} mentions created`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
