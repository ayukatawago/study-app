import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '社会学習',
  description: 'Study app for memorizing Japanese history, culture and constitution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{children}</body>
    </html>
  );
}