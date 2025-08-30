interface StudyProgressStatsProps {
  categoryName: string;
  seenCount: number;
  correctCount: number;
  incorrectCount: number;
}

export default function StudyProgressStats({
  categoryName,
  seenCount,
  correctCount,
  incorrectCount,
}: StudyProgressStatsProps) {
  return (
    <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <h2 className="font-bold mb-2 text-gray-900 dark:text-white">学習状況 ({categoryName})</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">学習済み</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{seenCount}</p>
        </div>
        <div>
          <p className="text-sm text-green-500">正解</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{correctCount}</p>
        </div>
        <div>
          <p className="text-sm text-red-500">不正解</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{incorrectCount}</p>
        </div>
      </div>
    </div>
  );
}
