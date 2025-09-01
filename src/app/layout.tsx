import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: '暗記学習',
  description: '社会・理科の重要ポイントを効率的に暗記するための学習アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full" suppressHydrationWarning>
      <body className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
