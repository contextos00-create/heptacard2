import { KnowledgeCard } from '../types';

export const INITIAL_CARDS: KnowledgeCard[] = [
  // Card 1: Docker Cheat Sheet (Image 1)
  {
    id: 'card-1',
    category: 'cheat-sheet',
    title: 'REFERENCE CHEAT SHEET: DOCKER & CONTAINERS',
    badge: 'CHEAT SHEET',
    metadata: 'Doc: DevOps Quick-Ref • Version 2.4 • Pinned in Infrastructure Cluster',
    footer: 'STATUS: Verified against staging compose.yml • 1-click clipboard copy active',
    isBookmarked: true,
    isRead: true,
    tags: ['docker', 'devops', 'containers', 'cli'],
    commands: [
      {
        id: 'cmd-1',
        command: '$ docker compose up -d --build',
        description: 'Spin up stack with fresh rebuild in background',
      },
      {
        id: 'cmd-2',
        command: '$ docker exec -it context_db psql -U postgres',
        description: 'Interactive shell into primary database container',
      },
      {
        id: 'cmd-3',
        command: '$ docker stats --no-stream',
        description: 'Single-snapshot resource utilization matrix',
      },
    ],
    essentialFlags: [
      { flag: '-d', description: 'Detached daemon mode' },
      { flag: '--build', description: 'Recompile Dockerfile cache' },
      { flag: '-v', description: 'Mount persistent host volume' },
    ],
  },

  // Card 2: RSS Feed Dispatch (Image 2)
  {
    id: 'card-2',
    category: 'rss-dispatch',
    title: 'RSS FEED: TECH & COGNITIVE SCIENCE DISPATCH',
    badge: 'RSS DISPATCH',
    feedUrl: '/feeds/tech-cogsci.xml',
    unreadCount: 14,
    syncedAgo: '12 mins ago',
    metadata: 'Feed URL: /feeds/tech-cogsci.xml • 14 Unread • Synced 12 mins ago',
    footer: 'ACTIONS: [ Ingest All to Canvas ] [ Filter by Vector Similarity ] [ Mark as Read ]',
    isBookmarked: false,
    isRead: false,
    tags: ['rss', 'cogsci', 'tools-for-thought', 'feed'],
    items: [
      {
        id: 'rss-1',
        indexStr: '01',
        timeStr: '[10:15 AM]',
        title: 'Douglas Engelbart Archive: The Augmentation of Human Intellect (Reprint)',
        typeOrDuration: '12 min read',
        read: false,
      },
      {
        id: 'rss-2',
        indexStr: '02:',
        timeStr: '[Yesterday]',
        title: 'Bret Victor: Media for Thinking the Unthinkable',
        typeOrDuration: 'Interactive Essay',
        read: false,
      },
      {
        id: 'rss-3',
        indexStr: '03:',
        timeStr: '[Oct 26]',
        title: 'Andy Matuschak: How can we develop transformative tools for thought?',
        typeOrDuration: 'Working Notes',
        read: false,
      },
    ],
  },

  // Card 3: Founder Interview (Image 3)
  {
    id: 'card-3',
    category: 'interview-qa',
    titleLabel: 'Title: FOUNDER INTERVIEW: BUILDING LOCAL-FIRST PKM TOOLS',
    title: 'QUALITATIVE INTERVIEW: FOUNDER DEEP-DIVE',
    badge: 'INTERVIEW Q&A',
    participant: 'Linus E. (Software Architect)',
    session: '45 min Remote • Transcribed with Whisper',
    metadata: 'Participant: Linus E. (Software Architect) • Session: 45 min Remote • Transcribed with Whisper',
    footer: 'PROVENANCE: Audio recording verified • Linked to Chapter 2 Methodology',
    isBookmarked: true,
    isRead: true,
    tags: ['interview', 'local-first', 'pkm', 'whisper'],
    transcript: [
      {
        speaker: 'INTERVIEWER',
        timestamp: '14:20',
        text: '"Why do users resist traditional tree folder hierarchies?"',
      },
      {
        speaker: 'LINUS',
        timestamp: '14:24',
        text: '"Folders force an artificial taxonomy before you actually understand what you are thinking. Spatial canvases allow ideas to breathe and find their organic neighbours first."',
        isQuote: true,
      },
    ],
    emergentThemes: [
      'Folder Resistance',
      'Premature Taxonomy Friction',
      'Spatial Proximity as Semantic Anchor',
    ],
  },

  // Card 4: PDF Excerpt Multi-Head Attention (Image 4)
  {
    id: 'card-4',
    category: 'pdf-excerpt',
    title: 'PDF EXCERPT: MULTI-HEAD ATTENTION DEEP DIVE',
    badge: 'PDF EXCERPT',
    documentName: 'Vaswani_Attention_2017.pdf',
    pageInfo: 'Page 04 of 15',
    securityHash: 'SHA-256 Anchored',
    metadata: 'Document: Vaswani_Attention_2017.pdf • Page 04 of 15 • SHA-256 Anchored',
    footer: 'PROVENANCE: Verifiable cryptographic PDF anchor stored locally',
    isBookmarked: true,
    isRead: true,
    tags: ['transformers', 'attention', 'arxiv', 'deep-learning'],
    formulaLabel: 'Scaled Dot-Product Formula',
    formulaLatex: 'Attention(Q, K, V) = softmax( \\frac{QK^T}{\\sqrt{d_k}} ) V',
    excerptSnippet:
      'An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.',
    metadataPoints: [
      'Section: 3.2 Scaled Dot-Product',
      '12 Inline Citations Found',
      'Mathematical Proof Verified',
    ],
  },

  // Card 5: Recipe & Baker's Ratios (Image 5)
  {
    id: 'card-5',
    category: 'recipe-log',
    title: 'RECIPE & BAKERS RATIOS: COUNTRY SOURDOUGH',
    badge: 'RECIPE LOG',
    yieldText: '2 Loaves (850g)',
    hydrationPercent: 78,
    fermentationText: '14 hrs cold retard',
    metadata: 'Yield: 2 Loaves (850g) • Hydration: 78% • Fermentation: 14 hrs cold retard',
    footer: 'KITCHEN LOG: Batch #24 scored with spiral lame • Baked in 450°F Dutch oven',
    isBookmarked: false,
    isRead: true,
    tags: ['culinary', 'fermentation', 'bakers-math', 'sourdough'],
    ingredients: [
      { name: 'Bread Flour (King Arthur)', weightGrams: 800, bakersPercent: 80 },
      { name: 'Whole Wheat Flour', weightGrams: 200, bakersPercent: 20 },
      { name: 'Water (filtered, 80°F)', weightGrams: 780, bakersPercent: 78 },
      { name: 'Mature Leaven (100% hyd)', weightGrams: 200, bakersPercent: 20 },
      { name: 'Fine Sea Salt', weightGrams: 20, bakersPercent: 2.0 },
    ],
    procedureSteps: [
      { time: '09:00 AM', step: 'Autolyse 60 mins' },
      { time: '10:00 AM', step: 'Incorporate leaven & salt' },
      { time: '10:30 - 12:30', step: '4x Stretch & Folds' },
    ],
    kitchenLog: 'Batch #24 scored with spiral lame • Baked in 450°F Dutch oven',
  },

  // Card 6: Curated Thread Karpathy (Image 6)
  {
    id: 'card-6',
    category: 'x-thread',
    title: 'CURATED THREAD: ANDREJ KARPATHY — LLM AS AN OS',
    badge: '𝕏 THREAD',
    author: '@karpathy',
    threadStats: '5-Post Thread • Synced via Readwise / Bookmarks',
    metadata: 'Author: @karpathy • 5-Post Thread • Synced via Readwise / Bookmarks',
    footer: 'PINNED: Connected to System Architecture ERD • 3 cards linked',
    isBookmarked: true,
    isRead: true,
    tags: ['karpathy', 'llm', 'operating-systems', 'architecture'],
    quoteText:
      '"LLMs are not chatbots; they are the central processing units (CPUs) of a new operating system. Context window is RAM, disk is your vector database, and browsing/Python interpreter are I/O peripherals."',
    conceptualParallels: [
      { concept: 'RAM', mapping: 'Context Window' },
      { concept: 'Disk', mapping: 'Vector Store / Files' },
      { concept: 'Peripherals', mapping: 'Tools & APIs' },
    ],
    pinnedNote: 'Connected to System Architecture ERD • 3 cards linked',
  },

  // Card 7: Stratechery Newsletter (Image 7)
  {
    id: 'card-7',
    category: 'newsletter',
    title: 'NEWSLETTER: STRATECHERY — AGGREGATION THEORY IN AI',
    badge: 'NEWSLETTER',
    edition: 'Weekly Article #412',
    syncSource: 'Ingested via Substack Email Sync',
    date: 'Oct 28',
    metadata: 'Edition: Weekly Article #412 • Ingested via Substack Email Sync • Date: Oct 28',
    footer: 'DISPATCH SYNC: Automatically pinned to Strategy Board • 4 cards reference this issue',
    isBookmarked: false,
    isRead: true,
    tags: ['stratechery', 'ben-thompson', 'aggregation-theory', 'economics'],
    quoteText:
      '“AI changes the marginal cost of content generation to zero, shifting the economic bottleneck from supply creation to relational discovery and trustworthy verification.”',
    strategicMoats: [
      'Zero Marginal Generation',
      'Trustworthy Verification',
      'Direct Audience Relationship',
    ],
    dispatchSyncNote: 'Automatically pinned to Strategy Board • 4 cards reference this issue',
  },

  // Card 8: Video Excerpt 3Blue1Brown (Image 8)
  {
    id: 'card-8',
    category: 'video-clip',
    title: 'VIDEO EXCERPT: 3BLUE1BROWN— NEURAL NETWORKS',
    badge: 'VIDEO CLIP',
    sourceTitle: 'VIDEO EXCERPT: 3BLUE1BROWN — YOUTUBE & VIDEO',
    currentTime: '08:45',
    totalTime: '19:22',
    metadata: 'VIDEO EXCERPT: 3BLUE1BROWN — YOUTUBE & VIDEO',
    footer: 'MEDIA ANCHOR: Video clip synced with Canvas Timestamp Annotator',
    isBookmarked: true,
    isRead: false,
    tags: ['3blue1brown', 'backprop', 'math', 'neural-nets'],
    formulaLatex: '\\frac{\\partial C}{\\partial w} = \\frac{\\partial z}{\\partial w} * \\frac{\\partial a}{\\partial z} * \\frac{\\partial C}{\\partial a}',
    keyInsights: [
      'Gradient descent calculates steepest downhill vector in weight space',
      'Matrix operations optimize batch learning',
      'Re-watch timestamp 12:30 for matrix dimensions',
    ],
    mediaAnchorText: 'Video clip synced with Canvas Timestamp Annotator',
  },

  // Card 9: Podcast Chapter Huberman Lab (Image 9)
  {
    id: 'card-9',
    category: 'audio-podcast',
    title: 'PODCAST CHAPTER: HUBERMAN LAB #84',
    badge: 'AUDIO PODCAST',
    currentTime: '34:12',
    totalTime: '01:52:00',
    chapterTitle: 'Chapter 04: Visual Stare Technique',
    metadata: 'Chapter 04: Visual Stare Technique • 34:12 / 01:52:00',
    footer: 'EPISODE LINK: Spotify Timed Anchor • Ingested automatically via RSS',
    isBookmarked: true,
    isRead: true,
    tags: ['huberman', 'neuroscience', 'focus', 'prefrontal-cortex'],
    quoteText:
      '“Maintaining visual focus on a single target for 60 to 90 seconds prior to cognitive work dramatically recruits the attentional circuits of the prefrontal cortex.”',
    episodeLinkText: 'Spotify Timed Anchor • Ingested automatically via RSS',
  },

  // Card 10: Web Clip Paul Graham (Image 10)
  {
    id: 'card-10',
    category: 'web-article',
    title: 'WEB CLIP: PAUL GRAHAM — HOW TO DO GREAT WORK',
    badge: 'WEB ARTICLE',
    sourceUrl: 'paulgraham.com/greatwork.html',
    readTime: '4 min read',
    metadata: 'Source: paulgraham.com/greatwork.html • Clipped via Browser Extension • 4 min read',
    footer: 'SOURCE PROVENANCE: Archived HTML snapshot stored locally (SHA-256 verified)',
    isBookmarked: false,
    isRead: true,
    tags: ['paul-graham', 'essays', 'craft', 'philosophy'],
    quoteText:
      '“If you wanted to make a list of people who changed the world, almost all of them would be people who did great work. And if you ask them what they did, they rarely say they were trying to change the world.”',
    metricsAndTags: [
      'Category: Essay / Intellectual Craft',
      '6 Key Passages Highlighted',
      'Connected to 2 Canvas Notes',
      'Reading Status: Completed',
    ],
    provenance: 'Archived HTML snapshot stored locally (SHA-256 verified)',
  },
];
