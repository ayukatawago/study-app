import CraftFlashcardDeck from './components/CraftFlashcardDeck';

export default function CraftsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">伝統工芸品</h1>
          <p className="text-gray-600 dark:text-gray-400">都道府県の伝統工芸品を覚えよう</p>
        </div>

        <CraftFlashcardDeck />
      </div>
    </div>
  );
}
