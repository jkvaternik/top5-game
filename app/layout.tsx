import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ 
  subsets: ["latin"] 
});



export const metadata: Metadata = {
  title: "Top 5",
  description: "A daily trivia game in which players guess the top five results of a given topic. Each day there is a new topic to test your knowledge, try to guess them in order if you can! Play today's list and share with your friends!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Comment out Suspense block when developing */}
      {/* <Suspense> */}
        <body className={inter.className}>{children}</body>
      {/* </Suspense> */}
    </html>
  );
}
