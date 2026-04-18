import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // Cleanup existing data
  await prisma.star.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.visit.deleteMany({});
  await prisma.highlight.deleteMany({});
  await prisma.heritage.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedPassword,
        username: 'rajesh_explorer',
        displayName: 'Rajesh Kumar',
        bio: 'Chasing stories in every fort and step-well',
        city: 'Jaipur',
        country: 'India',
        languagesSpoken: ['Hindi', 'English', 'Marwari'],
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Amita Singh',
        email: 'amita@example.com',
        password: hashedPassword,
        username: 'amita_travels',
        displayName: 'Amita S.',
        bio: 'Cultural photographer and history enthusiast.',
        city: 'Udaipur',
        country: 'India',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Vikram Dev',
        email: 'vikram@example.com',
        password: hashedPassword,
        username: 'v_historian',
        displayName: 'Vikram D.',
        bio: 'Archiving oral histories one village at a time.',
        city: 'Delhi',
        country: 'India',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      }
    })
  ]);

  const rajesh = users[0];
  const amita = users[1];
  const vikram = users[2];

  // 2. Create Heritage Sites
  const sites = await Promise.all([
    prisma.heritage.create({
      data: {
        name: 'Taj Mahal',
        description: 'An ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra.',
        location: 'Agra, Uttar Pradesh',
        latitude: 27.1751,
        longitude: 78.0421,
        city: 'Agra',
        state: 'Uttar Pradesh',
        category: 'Mausoleum',
        images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200'],
        languages: { hi: true, en: true, fr: true },
        isVerified: true,
      }
    }),
    prisma.heritage.create({
      data: {
        name: 'Amber Fort',
        description: 'A majestic fort situated on a hill near Jaipur with intricate Mughal architecture.',
        location: 'Amer, Jaipur, Rajasthan',
        latitude: 26.9855,
        longitude: 75.8513,
        city: 'Jaipur',
        state: 'Rajasthan',
        category: 'Fort',
        images: ['https://images.unsplash.com/photo-1599395293282-eeb7a921d7b1?q=80&w=1200'],
        languages: { hi: true, en: true },
      }
    }),
    prisma.heritage.create({
      data: {
        name: 'Hawa Mahal',
        description: 'The "Palace of Winds", known for its 953 small windows called jharokhas.',
        location: 'Hawa Mahal Rd, Jaipur',
        latitude: 26.9239,
        longitude: 75.8267,
        city: 'Jaipur',
        state: 'Rajasthan',
        category: 'Palace',
        images: ['https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1200'],
        languages: { hi: true, en: true },
      }
    }),
    prisma.heritage.create({
      data: {
        name: 'Qutub Minar',
        description: 'A 73-metre tall tapering tower of five storeys, and a UNESCO World Heritage site.',
        location: 'Mehrauli, New Delhi',
        latitude: 28.5244,
        longitude: 77.1855,
        city: 'Delhi',
        state: 'Delhi',
        category: 'Monument',
        images: ['https://images.unsplash.com/photo-1587823521319-5d447477641f?q=80&w=1200'],
        languages: { hi: true, en: true },
        isVerified: true,
      }
    }),
    prisma.heritage.create({
      data: {
        name: 'Konark Sun Temple',
        description: 'A 13th-century Sun Temple at Konark, designed as a colossal chariot.',
        location: 'Konark, Odisha',
        latitude: 19.8876,
        longitude: 86.0945,
        city: 'Konark',
        state: 'Odisha',
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1200'],
        languages: { or: true, hi: true, en: true },
      }
    }),
    prisma.heritage.create({
      data: {
        name: 'Rani ki Vav',
        description: 'An intricately constructed stepwell situated in the town of Patan.',
        location: 'Patan, Gujarat',
        latitude: 23.8589,
        longitude: 72.1030,
        city: 'Patan',
        state: 'Gujarat',
        category: 'Stepwell',
        images: ['https://images.unsplash.com/photo-1631526685829-8438128f731c?q=80&w=1200'],
        languages: { gu: true, hi: true, en: true },
      }
    }),
    prisma.heritage.create({
      data: {
        name: 'Ellora Caves',
        description: 'One of the largest rock-cut monastery-temple cave complexes in the world.',
        location: 'Sambhajinagar, Maharashtra',
        latitude: 20.0267,
        longitude: 75.1793,
        city: 'Sambhajinagar',
        state: 'Maharashtra',
        category: 'Caves',
        images: ['https://images.unsplash.com/photo-1627438466810-671c50d4d732?q=80&w=1200'],
        languages: { mr: true, hi: true, en: true },
      }
    })
  ]);

  const [taj, amber, hawa, qutub, konark, rani, ellora] = sites;

  // 3. Create Highlights
  const jaipurHigh = await prisma.highlight.create({
    data: {
      userId: rajesh.id,
      title: 'Rajasthan 2024',
      coverImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop',
    }
  });

  // 4. Create Visits
  await prisma.visit.createMany({
    data: [
      {
        userId: rajesh.id,
        heritageId: amber.id,
        highlightId: jaipurHigh.id,
        caption: 'Stunning architecture at the top of the hill.',
        tokensEarned: 15,
      },
      {
        userId: rajesh.id,
        heritageId: hawa.id,
        highlightId: jaipurHigh.id,
        caption: 'The palace of winds.',
        tokensEarned: 10,
      },
      {
        userId: amita.id,
        heritageId: taj.id,
        caption: 'A dream in marble.',
        tokensEarned: 25,
      },
      {
        userId: vikram.id,
        heritageId: qutub.id,
        caption: 'History in the heart of Delhi.',
        tokensEarned: 15,
      }
    ]
  });

  // 5. Create Badges
  await prisma.badge.createMany({
    data: [
      { userId: rajesh.id, badgeType: 'EXPLORER_10', earnedAt: new Date('2024-10-15') },
      { userId: amita.id, badgeType: 'PHOTOGRAPHER_MASTER', earnedAt: new Date('2024-11-20') },
      { userId: vikram.id, badgeType: 'ARCHIVE_COLLECTOR', earnedAt: new Date('2024-11-25') },
    ]
  });

  // 6. Create Stars
  await prisma.star.createMany({
    data: [
      { giverId: amita.id, receiverId: rajesh.id },
      { giverId: vikram.id, receiverId: rajesh.id },
      { giverId: rajesh.id, receiverId: amita.id },
    ]
  });

  // 7. Create Communities
  const comms = await Promise.all([
    prisma.community.create({
      data: {
        name: 'Mughal Architecture Enthusiasts',
        description: 'A dedicated group for those who study the intricate details of Mughal forts, gardens, and tombs across the subcontinent.',
        interest: 'Architecture',
        creatorId: rajesh.id,
      }
    }),
    prisma.community.create({
      data: {
        name: 'Vedic Ruins Explorers',
        description: 'Searching for the roots of our civilizations through ancient ruins and archaeological findings.',
        interest: 'History',
        creatorId: vikram.id,
      }
    }),
    prisma.community.create({
      data: {
        name: 'Heritage Photographers',
        description: 'Capturing the soul of India\'s monuments through the lens. Share tips, spots, and your best shots.',
        interest: 'Photography',
        creatorId: amita.id,
      }
    })
  ]);

  const [mughal, vedic, photo] = comms;

  // 8. Add Members to Communities
  await prisma.communityMember.createMany({
    data: [
      { userId: amita.id, communityId: mughal.id, role: 'MEMBER' },
      { userId: vikram.id, communityId: mughal.id, role: 'MEMBER' },
      { userId: rajesh.id, communityId: vedic.id, role: 'MEMBER' },
      { userId: rajesh.id, communityId: photo.id, role: 'MEMBER' },
    ]
  });

  // 9. Add Sample Messages
  await prisma.communityMessage.createMany({
    data: [
      {
        userId: rajesh.id,
        communityId: mughal.id,
        text: 'Has anyone visited the Bibi Ka Maqbara recently? I am planning a trip next month.',
        createdAt: new Date('2024-11-01T10:00:00Z'),
      },
      {
        userId: amita.id,
        communityId: mughal.id,
        text: 'Yes! The lighting at sunset is absolutely divine for photography. You must go.',
        createdAt: new Date('2024-11-01T10:05:00Z'),
      },
      {
        userId: vikram.id,
        communityId: vedic.id,
        text: 'The recent excavations near Sanchi are revealing some fascinating pottery patterns.',
        createdAt: new Date('2024-11-05T14:00:00Z'),
      }
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
