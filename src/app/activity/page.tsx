'use client';

import { useEffect, useState } from 'react';
import {
  getDailyActivityList,
  getPageDisplayName,
  getSubjectName,
  getPageUrl,
  DailyActivityData,
} from '@/utils/dailyActivity';
import PageHeader from '@/components/common/PageHeader';
import Link from 'next/link';

export default function ActivityPage() {
  const [activityData, setActivityData] = useState<DailyActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getDailyActivityList();
    setActivityData(data);
    setLoading(false);
  }, []);

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

        {Object.keys(groupedByDate).length === 0 ? (
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
            {Object.entries(groupedByDate)
              .sort(([a], [b]) => b.localeCompare(a)) // Sort by date descending
              .map(([date, activities]) => {
                const dailyTotals = calculateDailyTotals(activities);
                const accuracyRate =
                  dailyTotals.attempts > 0
                    ? Math.round((dailyTotals.correct / dailyTotals.attempts) * 100)
                    : 0;

                return (
                  <div
                    key={date}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatDate(date)}
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          合計: {dailyTotals.attempts}問 / 正解: {dailyTotals.correct}問 / 正解率:{' '}
                          {accuracyRate}%
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
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
                            {activities.map((activity, index) => {
                              const pageAccuracy =
                                activity.quizAttempts > 0
                                  ? Math.round(
                                      (activity.correctAnswers / activity.quizAttempts) * 100
                                    )
                                  : 0;

                              return (
                                <tr
                                  key={index}
                                  className="border-b border-gray-100 dark:border-gray-700"
                                >
                                  <td className="py-3 text-gray-900 dark:text-white font-medium">
                                    {getSubjectName(activity.pageName)}
                                  </td>
                                  <td className="py-3">
                                    <Link
                                      href={getPageUrl(activity.pageName)}
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
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
                );
              })}
          </div>
        )}
      </div>
    </main>
  );
}
