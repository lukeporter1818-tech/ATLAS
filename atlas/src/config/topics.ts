export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TopicConfig {
  day: Weekday;
  name: string;
  description: string;
  subreddits: string[];
  keywords: string[];
  prescriptionScope?: 'organizing-only';
}

export const TOPICS: Record<Weekday, TopicConfig> = {
  mon: {
    day: 'mon',
    name: 'Money & cost of living',
    description:
      'Everyday budgeting, bills, debt, and paycheck pressure — the recurring financial friction most households live inside.',
    subreddits: [
      'personalfinance',
      'povertyfinance',
      'Frugal',
      'MiddleClassFinance',
      'StudentLoans',
      'budget',
    ],
    keywords: ['rent', 'groceries', 'bills', 'debt', 'paycheck', 'savings', 'budget'],
  },
  tue: {
    day: 'tue',
    name: 'Health & fitness',
    description:
      'Everyday health, exercise, sleep, and nutrition struggles. Organizing/tracking framing only — never clinical advice.',
    subreddits: [
      'loseit',
      'Fitness',
      'xxfitness',
      'nutrition',
      'running',
      'bodyweightfitness',
    ],
    keywords: ['workout', 'diet', 'sleep', 'weight', 'injury', 'plateau'],
  },
  wed: {
    day: 'wed',
    name: 'Work & careers',
    description:
      'Job search, workplace friction, and career navigation — resumes, interviews, managers, and pay.',
    subreddits: [
      'jobs',
      'careerguidance',
      'cscareerquestions',
      'recruitinghell',
      'AskHR',
      'WorkReform',
    ],
    keywords: ['interview', 'resume', 'layoff', 'remote', 'manager', 'salary', 'promotion'],
  },
  thu: {
    day: 'thu',
    name: 'Small business & trades',
    description:
      'Owner-operator and trade contractor pain — invoicing, quoting, hiring, and running the day-to-day.',
    subreddits: [
      'smallbusiness',
      'Entrepreneur',
      'Construction',
      'Plumbing',
      'electricians',
      'HVAC',
      'Roofing',
    ],
    keywords: ['invoice', 'quote', 'customer', 'subcontractor', 'marketing', 'hiring', 'insurance'],
  },
  fri: {
    day: 'fri',
    name: 'Home & family',
    description:
      'Running a household — kids, chores, repairs, contractors, meals, and the family calendar.',
    subreddits: [
      'HomeImprovement',
      'Parenting',
      'daddit',
      'Mommit',
      'DIY',
      'Homeowners',
    ],
    keywords: ['kids', 'chores', 'repair', 'contractor', 'school', 'meals', 'schedule'],
  },
  sat: {
    day: 'sat',
    name: 'Tech & digital life',
    description:
      'Personal tech friction — devices, accounts, backups, wifi, and the app/subscription sprawl of daily digital life.',
    subreddits: [
      'techsupport',
      'AppleHelp',
      'HomeNetworking',
      'software',
      'privacy',
      'selfhosted',
    ],
    keywords: ['password', 'backup', 'sync', 'wifi', 'printer', 'subscription', 'migration'],
  },
  sun: {
    day: 'sun',
    name: 'Wellbeing & relationships',
    description:
      'Habits, routines, motivation, and interpersonal friction. Prescriptions must be organizing/tracking tools only — never clinical or therapeutic advice.',
    subreddits: [
      'getdisciplined',
      'productivity',
      'Habits',
      'socialskills',
      'DecidingToBeBetter',
      'getmotivated',
    ],
    keywords: ['habit', 'routine', 'journal', 'friendship', 'communication', 'boundary'],
    prescriptionScope: 'organizing-only',
  },
};

export function getTodaysTopic(now: Date = new Date()): TopicConfig {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  })
    .format(now)
    .toLowerCase() as Weekday;
  return TOPICS[weekday];
}
