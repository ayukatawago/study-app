export interface DailyActivityData {
  date: string;
  quizAttempts: number;
  correctAnswers: number;
  pageName: string;
}

export interface DailyStats {
  [date: string]: {
    [pageName: string]: {
      quizAttempts: number;
      correctAnswers: number;
    };
  };
}

const DAILY_ACTIVITY_KEY = 'daily_activity_stats';

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function getDailyStats(): DailyStats {
  if (typeof window === 'undefined') return {};

  const stored = localStorage.getItem(DAILY_ACTIVITY_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function saveDailyStats(stats: DailyStats): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(stats));
}

export function trackQuizAttempt(pageName: string): void {
  const today = getTodayDateString();
  const stats = getDailyStats();

  if (!stats[today]) {
    stats[today] = {};
  }

  if (!stats[today][pageName]) {
    stats[today][pageName] = {
      quizAttempts: 0,
      correctAnswers: 0,
    };
  }

  stats[today][pageName].quizAttempts += 1;
  saveDailyStats(stats);
}

export function trackCorrectAnswer(pageName: string): void {
  const today = getTodayDateString();
  const stats = getDailyStats();

  if (!stats[today]) {
    stats[today] = {};
  }

  if (!stats[today][pageName]) {
    stats[today][pageName] = {
      quizAttempts: 0,
      correctAnswers: 0,
    };
  }

  stats[today][pageName].correctAnswers += 1;
  saveDailyStats(stats);
}

export function getDailyActivityList(): DailyActivityData[] {
  const stats = getDailyStats();
  const result: DailyActivityData[] = [];

  Object.entries(stats).forEach(([date, dateStats]) => {
    Object.entries(dateStats).forEach(([pageName, pageStats]) => {
      result.push({
        date,
        pageName,
        quizAttempts: pageStats.quizAttempts,
        correctAnswers: pageStats.correctAnswers,
      });
    });
  });

  // Sort by date (newest first)
  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPageDisplayName(pageName: string): string {
  const pageNameMap: { [key: string]: string } = {
    history: '歴史年号',
    culture: '文化人物',
    constitution: '日本国憲法',
    'world-country': '世界の国々',
    'international-community': '国際社会',
    animals: '動物クイズ',
    human: '人体クイズ',
    prefectures: '都道府県',
    crafts: '伝統工芸',
    idioms: '日本のことわざ',
  };

  return pageNameMap[pageName] || pageName;
}
