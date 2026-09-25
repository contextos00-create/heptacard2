export type CardCategory =
  | 'cheat-sheet'
  | 'rss-dispatch'
  | 'interview-qa'
  | 'pdf-excerpt'
  | 'recipe-log'
  | 'x-thread'
  | 'newsletter'
  | 'video-clip'
  | 'audio-podcast'
  | 'web-article'
  | 'ai-generated';

export interface BaseCardData {
  id: string;
  title: string;
  badge: string;
  category: CardCategory;
  metadata: string;
  footer: string;
  isBookmarked?: boolean;
  isRead?: boolean;
  tags?: string[];
  createdAt?: string;
}

export interface DockerCheatSheetData extends BaseCardData {
  category: 'cheat-sheet';
  commands: {
    command: string;
    description?: string;
    id: string;
  }[];
  essentialFlags: {
    flag: string;
    description: string;
  }[];
}

export interface RssFeedData extends BaseCardData {
  category: 'rss-dispatch';
  feedUrl: string;
  unreadCount: number;
  syncedAgo: string;
  items: {
    id: string;
    indexStr: string;
    timeStr: string;
    title: string;
    typeOrDuration: string;
    read: boolean;
  }[];
}

export interface FounderInterviewData extends BaseCardData {
  category: 'interview-qa';
  titleLabel: string;
  participant: string;
  session: string;
  transcript: {
    speaker: string;
    timestamp: string;
    text: string;
    isQuote?: boolean;
  }[];
  emergentThemes: string[];
}

export interface PdfExcerptData extends BaseCardData {
  category: 'pdf-excerpt';
  documentName: string;
  pageInfo: string;
  securityHash: string;
  formulaLabel: string;
  formulaLatex: string;
  excerptSnippet: string;
  metadataPoints: string[];
}

export interface SourdoughRecipeData extends BaseCardData {
  category: 'recipe-log';
  yieldText: string;
  hydrationPercent: number;
  fermentationText: string;
  ingredients: {
    name: string;
    weightGrams: number;
    bakersPercent: number;
  }[];
  procedureSteps: {
    time: string;
    step: string;
  }[];
  kitchenLog: string;
}

export interface CuratedThreadData extends BaseCardData {
  category: 'x-thread';
  author: string;
  threadStats: string;
  quoteText: string;
  conceptualParallels: {
    concept: string;
    mapping: string;
  }[];
  pinnedNote: string;
}

export interface StratecheryNewsletterData extends BaseCardData {
  category: 'newsletter';
  edition: string;
  syncSource: string;
  date: string;
  quoteText: string;
  strategicMoats: string[];
  dispatchSyncNote: string;
}

export interface VideoExcerptData extends BaseCardData {
  category: 'video-clip';
  sourceTitle: string;
  currentTime: string;
  totalTime: string;
  formulaLatex: string;
  keyInsights: string[];
  mediaAnchorText: string;
}

export interface PodcastChapterData extends BaseCardData {
  category: 'audio-podcast';
  currentTime: string;
  totalTime: string;
  chapterTitle: string;
  quoteText: string;
  episodeLinkText: string;
}

export interface WebClipData extends BaseCardData {
  category: 'web-article';
  sourceUrl: string;
  readTime: string;
  quoteText: string;
  metricsAndTags: string[];
  provenance: string;
}

export interface AiGeneratedCardData extends BaseCardData {
  category: 'ai-generated';
  leftTitle: string;
  leftContent: string;
  rightTitle: string;
  rightItems: string[];
}

export type KnowledgeCard =
  | DockerCheatSheetData
  | RssFeedData
  | FounderInterviewData
  | PdfExcerptData
  | SourdoughRecipeData
  | CuratedThreadData
  | StratecheryNewsletterData
  | VideoExcerptData
  | PodcastChapterData
  | WebClipData
  | AiGeneratedCardData;

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  avatarUrl: string;
  bio: string;
  cardsCount: number;
  storageMb: number;
  maxStorageMb: number;
  streakDays: number;
  lastSynced: string;
  isSyncing: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}
