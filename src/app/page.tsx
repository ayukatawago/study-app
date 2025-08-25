import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full text-center space-y-8 px-4 sm:px-0">
        <h1 className="text-blue-600 text-4xl font-bold">暗記学習サポート</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* 社会セクション */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">社会</h2>
            <div className="flex flex-col space-y-3">
              <Link
                href="/history"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                歴史 年代
              </Link>
              <Link
                href="/culture"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                歴史 文化・人物
              </Link>
              <Link
                href="/constitution"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                日本国憲法
              </Link>
              <Link
                href="/world-country"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                世界地図
              </Link>
              <Link
                href="/international-community"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                国際社会
              </Link>
              <Link
                href="/prefectures"
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                都道府県
              </Link>
            </div>
          </div>

          {/* 理科セクション */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">理科</h2>
            <div className="flex flex-col space-y-3">
              <Link
                href="/animals"
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                動物
              </Link>
              <Link
                href="/human"
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                人体
              </Link>
              {/* 将来的に追加されるであろう理科のコンテンツ用のプレースホルダー */}
              <div className="text-gray-500 dark:text-gray-400 italic mt-2 text-sm">
                近日中に植物学習、地球科学など追加予定
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
