import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-3xl w-full text-center space-y-8 px-4 sm:px-0">
        <h1 className="text-blue-600 text-4xl font-bold">社会学習</h1>
        <p className="text-gray-700 dark:text-gray-300 text-xl">
          日本史の年代・文化・憲法・動物学習を暗記するための学習アプリ
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/history"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            年代を学習する
          </Link>
          <Link
            href="/culture"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            文化人物を学習する
          </Link>
          <Link
            href="/constitution"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            日本国憲法を学習する
          </Link>
          <Link
            href="/world-country"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            世界地図を学習する
          </Link>
          <Link
            href="/animals"
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            動物学習クイズ
          </Link>
        </div>
      </div>
    </main>
  );
}
