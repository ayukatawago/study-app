import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-3xl w-full text-center space-y-8 px-4 sm:px-0">
        <h1 className="text-blue-600 text-4xl font-bold">歴史年代</h1>
        <p className="text-gray-700 dark:text-gray-300 text-xl">
          日本史の年代を暗記するための学習アプリ
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/history"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            学習を始める
          </Link>
        </div>
      </div>
    </main>
  );
}