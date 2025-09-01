'use client';

import { useEffect, useState } from 'react';
import {
  getDailyActivityList,
  getPageDisplayName,
  getSubjectName,
  getPageUrl,
  clearAllActivityData,
  getHistogramData,
  getAvailablePages,
  DailyActivityData,
  HistogramData,
} from '@/utils/dailyActivity';
import PageHeader from '@/components/common/PageHeader';
import Link from 'next/link';
import ActivityHistogram from '@/components/charts/ActivityHistogram';
import { useIsDarkMode } from '@/hooks/useTheme';

export default function ActivityPage() {
  const [activityData, setActivityData] = useState<DailyActivityData[]>([]);
  const [histogramData, setHistogramData] = useState<HistogramData[]>([]);
  const [availablePages, setAvailablePages] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    const data = getDailyActivityList();
    const pages = getAvailablePages();
    const histogram = getHistogramData(selectedPage);
    setActivityData(data);
    setAvailablePages(pages);
    setHistogramData(histogram);
    setLoading(false);
  }, [selectedPage]);

  // Group activity data by date
  const groupedByDate = activityData.reduce(
    (acc, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = [];
      }
      acc[activity.date].push(activity);
      return acc;
    },
    {} as { [date: string]: DailyActivityData[] }
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const calculateDailyTotals = (activities: DailyActivityData[]) => {
    return activities.reduce(
      (totals, activity) => {
        totals.attempts += activity.quizAttempts;
        totals.correct += activity.correctAnswers;
        return totals;
      },
      { attempts: 0, correct: 0 }
    );
  };

  const handleClearActivity = () => {
    if (confirm('学習活動履歴をすべて削除しますか？この操作は取り消せません。')) {
      clearAllActivityData();
      setActivityData([]);
      setHistogramData([]);
      setAvailablePages([]);
    }
  };

  const handlePageFilterChange = (pageFilter: string) => {
    setSelectedPage(pageFilter);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  const getSelectedDateActivities = () => {
    if (!selectedDate) return [];
    let filtered = activityData.filter(activity => activity.date === selectedDate);

    // Apply page filter to modal data as well
    if (selectedPage !== 'all') {
      filtered = filtered.filter(activity => activity.pageName === selectedPage);
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <PageHeader title="学習活動履歴" />

        {/* Page Filter */}
        {availablePages.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <select
                  value={selectedPage}
                  onChange={e => handlePageFilterChange(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">すべてのページ</option>
                  {availablePages.map(pageName => (
                    <option key={pageName} value={pageName}>
                      {getPageDisplayName(pageName)} ({getSubjectName(pageName)})
                    </option>
                  ))}
                </select>
              </div>
              {histogramData.length > 0 && (
                <button
                  onClick={handleClearActivity}
                  className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                  title="履歴をクリア"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {histogramData.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                学習活動がありません
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                まだクイズに取り組んでいません。学習を始めてみましょう！
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                学習を始める
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ActivityHistogram
              data={histogramData.slice(0, 14).reverse()}
              onBarClick={handleDateClick}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Modal for detailed view */}
        {selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(selectedDate)} の詳細
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 text-gray-900 dark:text-white font-medium">
                          科目
                        </th>
                        <th className="text-left py-2 text-gray-900 dark:text-white font-medium">
                          学習ページ
                        </th>
                        <th className="text-right py-2 text-gray-900 dark:text-white font-medium">
                          挑戦問題数
                        </th>
                        <th className="text-right py-2 text-gray-900 dark:text-white font-medium">
                          正解数
                        </th>
                        <th className="text-right py-2 text-gray-900 dark:text-white font-medium">
                          正解率
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSelectedDateActivities().map((activity, index) => {
                        const pageAccuracy =
                          activity.quizAttempts > 0
                            ? Math.round((activity.correctAnswers / activity.quizAttempts) * 100)
                            : 0;

                        return (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 text-gray-900 dark:text-white font-medium">
                              {getSubjectName(activity.pageName)}
                            </td>
                            <td className="py-3">
                              <Link
                                href={getPageUrl(activity.pageName)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                                onClick={closeModal}
                              >
                                {getPageDisplayName(activity.pageName)}
                              </Link>
                            </td>
                            <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                              {activity.quizAttempts}問
                            </td>
                            <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                              {activity.correctAnswers}問
                            </td>
                            <td className="py-3 text-right">
                              <span
                                className={`font-medium ${
                                  pageAccuracy >= 80
                                    ? 'text-green-600 dark:text-green-400'
                                    : pageAccuracy >= 60
                                      ? 'text-yellow-600 dark:text-yellow-400'
                                      : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {pageAccuracy}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
