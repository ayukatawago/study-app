'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { HistogramData } from '@/utils/dailyActivity';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ActivityHistogramProps {
  data: HistogramData[];
  onBarClick: (date: string) => void;
  isDarkMode?: boolean;
}

export default function ActivityHistogram({
  data,
  onBarClick,
  isDarkMode = false,
}: ActivityHistogramProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  const chartData = {
    labels: data.map(item => formatDate(item.date)),
    datasets: [
      {
        label: '挑戦問題数',
        data: data.map(item => item.totalAttempts),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500 with opacity
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: '正解数',
        data: data.map(item => item.totalCorrect),
        backgroundColor: 'rgba(34, 197, 94, 0.8)', // green-500 with opacity
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? '#D1D5DB' : '#374151', // gray-300 : gray-700
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context: any) {
            const dataIndex = context.dataIndex;
            const accuracy = data[dataIndex]?.accuracyRate || 0;
            return `正解率: ${accuracy}%`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280', // gray-400 : gray-500
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: isDarkMode ? '#374151' : '#E5E7EB', // gray-700 : gray-200
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280', // gray-400 : gray-500
          stepSize: 1,
        },
        grid: {
          color: isDarkMode ? '#374151' : '#E5E7EB', // gray-700 : gray-200
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedDate = data[index]?.date;
        if (clickedDate) {
          onBarClick(clickedDate);
        }
      }
    },
    onHover: (event: any, elements: any) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">日別学習活動</h2>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">バーをクリックして詳細を表示</p>
      </div>
    </div>
  );
}
