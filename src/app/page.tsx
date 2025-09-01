import Link from 'next/link';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full text-center space-y-8 px-4 sm:px-0">
        <div className="relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-blue-600 dark:text-blue-400 text-4xl font-bold">暗記学習</h1>
            <Link
              href="/activity"
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              学習活動履歴
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* 社会セクション */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">社会</h2>

            {/* 地理 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">地理</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/world-country"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  世界地図
                </Link>
                <Link
                  href="/prefectures"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  都道府県
                </Link>
                <Link
                  href="/crafts"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  伝統工芸品
                </Link>
              </div>
            </div>

            {/* 歴史 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">歴史</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/history"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  年代
                </Link>
                <Link
                  href="/culture"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  文化・人物
                </Link>
              </div>
            </div>

            {/* 公民 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">公民</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/constitution"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  日本国憲法
                </Link>
                <Link
                  href="/international-community"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  国際社会
                </Link>
              </div>
            </div>
          </div>

          {/* 理科セクション */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">理科</h2>

            {/* 生物 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">生物</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/animals"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  動物
                </Link>
                <Link
                  href="/human"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  人体
                </Link>
              </div>
            </div>

            {/* 地学・物理・化学 - 将来の予定 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-3">
                  地学
                </h3>
                <div className="text-gray-500 dark:text-gray-400 italic text-sm">近日追加予定</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-3">
                  物理
                </h3>
                <div className="text-gray-500 dark:text-gray-400 italic text-sm">近日追加予定</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-3">
                  化学
                </h3>
                <div className="text-gray-500 dark:text-gray-400 italic text-sm">近日追加予定</div>
              </div>
            </div>
          </div>

          {/* 国語セクション */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">国語</h2>

            {/* 言語 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">言語</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/idioms"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  慣用句
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
