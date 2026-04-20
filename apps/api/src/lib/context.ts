import { PrismaClient } from '@bharatlens/db';

const prisma = new PrismaClient();

export interface RealTimeContext {
  weather: string;
  temperature: string;
  crowdDensity: 'Low' | 'Moderate' | 'High';
  specialEvent?: string;
}

export interface UserBehaviorProfile {
  preferredCategories: string[];
  totalVisits: number;
  lastVisitedSite?: string;
  expertiseLevel: 'Newbie' | 'Explorer' | 'Heritage Expert';
}

/**
 * Simulates fetching real-time environmental data for a destination.
 * In a real production app, this would call OpenWeatherMap or a Crowd Sensing API.
 */
export async function getDestinationContext(city: string): Promise<RealTimeContext> {
  // Mock logic based on city name for demo consistency
  const lowercaseCity = city.toLowerCase();
  
  if (lowercaseCity.includes('delhi')) {
    return { weather: 'Sunny but Hazy', temperature: '32°C', crowdDensity: 'High', specialEvent: 'G20 Anniversary Summit Prep' };
  } else if (lowercaseCity.includes('jaipur')) {
    return { weather: 'Clear Skies', temperature: '30°C', crowdDensity: 'Moderate' };
  } else if (lowercaseCity.includes('mumbai')) {
    return { weather: 'Tropical Humid', temperature: '28°C', crowdDensity: 'High' };
  }
  
  return { weather: 'Pleasant', temperature: '24°C', crowdDensity: 'Low' };
}

/**
 * Analyzes Prisma data to build a behavioral profile of the user.
 */
export async function getUserBehaviorProfile(userId: string): Promise<UserBehaviorProfile> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        visits: {
          include: { heritage: true }
        },
        badges: true
      }
    });

    if (!user) {
      return { preferredCategories: [], totalVisits: 0, expertiseLevel: 'Newbie' };
    }

    const categories = user.visits.map(v => v.heritage.category);
    const categoryCounts = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferred = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([cat]) => cat);

    let level: UserBehaviorProfile['expertiseLevel'] = 'Newbie';
    if (user.visits.length > 5) level = 'Explorer';
    if (user.visits.length > 15 || user.badges.length > 3) level = 'Heritage Expert';

    return {
      preferredCategories: preferred,
      totalVisits: user.visits.length,
      lastVisitedSite: user.visits[0]?.heritage.name,
      expertiseLevel: level
    };
  } catch (e) {
    console.error('Error building behavior profile:', e);
    return { preferredCategories: [], totalVisits: 0, expertiseLevel: 'Newbie' };
  }
}
