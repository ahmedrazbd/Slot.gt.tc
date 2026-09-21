export interface Platform {
  id: number;
  place: number;
  name: string;
  logo: string;
  affiliatedBy: string;
  badges: string[];
  rating: string;
  ratingScore: number;
  ctaUrl: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  clicksCount: number;
  isFavorite?: boolean;
  category?: 'vip' | 'instant' | 'live' | 'jackpots' | 'trends' | 'popular';
  description?: string;
}

export interface Offer {
  id: number;
  code: string;
  description: string;
  targetUserId: string;
  expiresAt: string | null;
  createdAt: string;
  active: boolean;
}

export interface ChatMessage {
  id: number;
  fromId: string;
  toId: string;
  content: string;
  isAdmin: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface ClickRecord {
  refCode: string;
  clicks: number;
  signups: number;
  platforms: Record<string, number>;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  refCode: string;
  refBy?: string | null;
  referralCount: number;
  joinedPlatforms?: string[];
  createdAt: string;
}

export type PlatformBadgeFilter =
  | 'all'
  | 'Vip-Sites'
  | 'Instant-Pay'
  | 'Live-Bet'
  | 'Jackpots'
  | 'Hi-Paying'
  | 'Trends';

export type ViewMode = 'grid' | 'table';
export type SortOption = 'rank' | 'rating' | 'clicks' | 'name';
export type ActiveTab = 'directory' | 'offers' | 'clicks' | 'messages' | 'sql';

export interface SqlQueryResult {
  columns: string[];
  values: any[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  rawQuery?: string;
}

export interface SqlTableSchema {
  name: string;
  rowCount: number;
  columns: { name: string; type: string; pk?: boolean }[];
}

