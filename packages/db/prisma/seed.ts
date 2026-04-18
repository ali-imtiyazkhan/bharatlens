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
  const rajesh = await prisma.user.create({
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
  });

  const amita = await prisma.user.create({
    data: {
      name: 'Amita Singh',
      email: 'amita@example.com',
      password: hashedPassword,
      username: 'amita_travels',
      displayName: 'Amita S.',
      city: 'Udaipur',
      country: 'India',
    }
  });

  // 2. Create Heritage Sites
  const amberFort = await prisma.heritage.create({
    data: {
      name: 'Amber Fort',
      description: 'A majestic fort situated on a hill near Jaipur.',
      location: 'Amer, Jaipur, Rajasthan',
      latitude: 26.9855,
      longitude: 75.8513,
      city: 'Jaipur',
      state: 'Rajasthan',
      category: 'Fort',
      images: ['https://images.unsplash.com/photo-1599395293282-eeb7a921d7b1?q=80&w=1200'],
      languages: { hi: true, en: true },
    }
  });

  const hawaMahal = await prisma.heritage.create({
    data: {
      name: 'Hawa Mahal',
      description: 'The Palace of Winds in Jaipur.',
      location: 'Hawa Mahal Rd, Jaipur',
      latitude: 26.9239,
      longitude: 75.8267,
      city: 'Jaipur',
      state: 'Rajasthan',
      category: 'Palace',
      images: ['https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1200'],
      languages: { hi: true, en: true },
    }
  });

  // 3. Create Highlights
  const jaipurHigh = await prisma.highlight.create({
    data: {
      userId: rajesh.id,
      title: 'Jaipur 2024',
      coverImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop',
    }
  });

  // 4. Create Visits
  await prisma.visit.create({
    data: {
      userId: rajesh.id,
      heritageId: amberFort.id,
      highlightId: jaipurHigh.id,
      photos: ['https://images.unsplash.com/photo-1599395293282-eeb7a921d7b1?q=80&w=800'],
      caption: 'Stunning architecture at the top of the hill. Avoided the elephant ride.',
      audioStoryUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    }
  });

  await prisma.visit.create({
    data: {
      userId: rajesh.id,
      heritageId: hawaMahal.id,
      highlightId: jaipurHigh.id,
      photos: ['https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=800'],
      caption: 'The palace of winds.',
      isPublic: true,
    }
  });

  // 5. Create Badges
  await prisma.badge.createMany({
    data: [
      { userId: rajesh.id, badgeType: 'EXPLORER_10', earnedAt: new Date('2024-10-15') },
      { userId: rajesh.id, badgeType: 'STAR_COLLECTOR_100', earnedAt: new Date('2024-11-01') },
    ]
  });

  // 6. Create Stars
  await prisma.star.create({
    data: {
      giverId: amita.id,
      receiverId: rajesh.id,
    }
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
