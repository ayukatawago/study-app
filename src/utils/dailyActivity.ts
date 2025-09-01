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
    history: '年代',
    culture: '文化・人物',
    constitution: '日本国憲法',
    world_country: '世界地図',
    'international-community': '国際社会',
    animal_quiz: '動物',
    human_quiz: '人体',
    prefecture: '都道府県',
    craft: '伝統工芸品',
    idiom: '慣用句',
  };

  return pageNameMap[pageName] || pageName;
}

export function getSubjectName(pageName: string): string {
  const subjectMap: { [key: string]: string } = {
    history: '社会',
    culture: '社会',
    constitution: '社会',
    world_country: '社会',
    'international-community': '社会',
    prefecture: '社会',
    craft: '社会',
    animal_quiz: '理科',
    human_quiz: '理科',
    idiom: '国語',
  };

  return subjectMap[pageName] || '不明';
}

export function getPageUrl(pageName: string): string {
  const urlMap: { [key: string]: string } = {
    history: '/history',
    culture: '/culture',
    constitution: '/constitution',
    world_country: '/world-country',
    'international-community': '/international-community',
    animal_quiz: '/animals',
    human_quiz: '/human',
    prefecture: '/prefectures',
    craft: '/crafts',
    idiom: '/idioms',
  };

  return urlMap[pageName] || `/${pageName}`;
}
