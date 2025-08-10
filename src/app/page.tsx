import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-blue-600 text-4xl font-bold">Japanese History Flashcards</h1>
        <p className="text-gray-700 dark:text-gray-300 text-xl">
          Study and memorize Japanese historical events by year
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/flashcards"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Start Studying
          </Link>
        </div>
      </div>
    </main>
  );
}