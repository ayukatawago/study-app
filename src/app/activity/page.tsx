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
import Link from 'next/link';
import ActivityHistogram from '@/components/charts/ActivityHistogram';
import { useIsDarkMode } from '@/hooks/useTheme';
import FilterDropdown from '@/components/common/FilterDropdown';
import ClearButton from '@/components/common/ClearButton';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

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
    return <LoadingSpinner />;
  }

  return (
    <PageContainer variant="wide" title="学習活動履歴">
      {/* Page Filter */}
      {availablePages.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FilterDropdown
                value={selectedPage}
                onChange={handlePageFilterChange}
                options={[
                  { value: 'all', label: 'すべてのページ' },
                  ...availablePages.map(pageName => ({
                    value: pageName,
                    label: `${getPageDisplayName(pageName)} (${getSubjectName(pageName)})`,
                  })),
                ]}
              />
            </div>
            {histogramData.length > 0 && (
              <ClearButton onClick={handleClearActivity} title="履歴をクリア" />
            )}
          </div>
        </div>
      )}

      {histogramData.length === 0 ? (
        <EmptyState
          title="学習活動がありません"
          description="まだクイズに取り組んでいません。学習を始めてみましょう！"
          actionLabel="学習を始める"
          actionHref="/"
        />
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
      <Modal
        isOpen={!!selectedDate}
        onClose={closeModal}
        title={selectedDate ? `${formatDate(selectedDate)} の詳細` : ''}
      >
        <DataTable
          columns={[
            {
              key: 'subject',
              label: '科目',
              render: (_, activity) => (
                <span className="text-gray-900 dark:text-white font-medium">
                  {getSubjectName(activity.pageName)}
                </span>
              ),
            },
            {
              key: 'page',
              label: '学習ページ',
              render: (_, activity) => (
                <Link
                  href={getPageUrl(activity.pageName)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                  onClick={closeModal}
                >
                  {getPageDisplayName(activity.pageName)}
                </Link>
              ),
            },
            {
              key: 'attempts',
              label: '挑戦問題数',
              align: 'right',
              render: (_, activity) => (
                <span className="text-gray-600 dark:text-gray-400">{activity.quizAttempts}問</span>
              ),
            },
            {
              key: 'correct',
              label: '正解数',
              align: 'right',
              render: (_, activity) => (
                <span className="text-gray-600 dark:text-gray-400">
                  {activity.correctAnswers}問
                </span>
              ),
            },
            {
              key: 'accuracy',
              label: '正解率',
              align: 'right',
              render: (_, activity) => {
                const pageAccuracy =
                  activity.quizAttempts > 0
                    ? Math.round((activity.correctAnswers / activity.quizAttempts) * 100)
                    : 0;
                return (
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
                );
              },
            },
          ]}
          data={getSelectedDateActivities()}
        />
      </Modal>
    </PageContainer>
  );
}
