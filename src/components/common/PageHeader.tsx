'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="relative flex justify-center items-center mb-8">
      <div className="absolute left-0">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <div className="absolute right-0">
        <ThemeToggle />
      </div>
    </div>
  );
}
