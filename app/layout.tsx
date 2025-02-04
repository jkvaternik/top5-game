import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Top 5: Daily Trivia Game',
  description:
    "A daily trivia game in which players guess the top five results of a given topic. Each day there is a new topic to test your knowledge, try to guess them in order if you can! Play today's list and share with your friends!",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-dark-purple`}>
        {children}
      </body>
    </html>
  );
}
