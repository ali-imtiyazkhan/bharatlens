export interface ItineraryRequest {
  destination: string;
  budget: string;
  days: number;
  interests: string[];
  userId: string;
}

export interface PlannerEvent {
  time: string;
  location: string;
  description: string;
  isHiddenGem: boolean;
}

export interface PlannerDay {
  day: number;
  title: string;
  events: PlannerEvent[];
}

export interface ItineraryPlan {
  days: PlannerDay[];
  summary: string;
}

export interface ItineraryResponse {
  id: string;
  title: string;
  destination: string;
  budget: string;
  days: number;
  plan: ItineraryPlan;
  userId: string;
  createdAt: Date;
}

export interface RecommendationRequest {
  budget: string;
  days: number;
  interests: string[];
  categoryFilter?: string;
}

export interface RecommendedDestination {
  name: string;
  country: string;
  category: string;
  history: string;
  whyItsGood: string;
  estimatedCost: string;
}

export interface RecommendationResponse {
  recommendations: RecommendedDestination[];
}

export interface DestinationInsightsRequest {
  destination: string;
}

export interface NewsItem {
  headline: string;
  source: string;
}

export interface DestinationInsightsResponse {
  dangerLevel: 'Low' | 'Moderate' | 'High';
  safetyAdvice: string;
  news: NewsItem[];
}
