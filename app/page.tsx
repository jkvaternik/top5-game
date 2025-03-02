'use client';

import React, { Suspense } from 'react';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation';

import { InstructionsModal } from './components/ModalComponent/Modals/InstructionsModal';
import GameView from './views/GameView';

import { isNewVisitor } from './utils';

export default function Home() {
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // const searchParams = useSearchParams()
  // const isArchiveMode = searchParams.has('date')

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const newUser = isNewVisitor();
    const isArchiveMode = window.location.href.includes('date');

    if (newUser && !isArchiveMode) {
      setShowInstructionsModal(true);
    }

    localStorage.setItem(
      'lastVisit',
      JSON.stringify(new Date().toLocaleString())
    );
  }, []);

  return (
    <main style={{ margin: '4vh auto' }} className="w-10/12 sm:w-8/12 md:w-1/2">
      <Suspense>
        <GameView setShowInstructionsModal={setShowInstructionsModal} />
      </Suspense>
      {showInstructionsModal && (
        <InstructionsModal
          isOpen={showInstructionsModal}
          onClose={() => setShowInstructionsModal(false)}
        />
      )}
      <Script
        src="https://umami.zachwal.sh/script.js"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        strategy="afterInteractive"
      />
    </main>
  );
}
