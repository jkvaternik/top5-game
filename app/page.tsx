"use client"

import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';

import { InstructionsModal } from "./components/ModalComponent/Modals/InstructionsModal";
import GameView from "./views/GameView";
import ErrorBoundary from "./components/ErrorBoundary"

import { isNewVisitor } from "./utils";

export default function Home() {
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const newUser = isNewVisitor();

    if (newUser) {
      setShowInstructionsModal(true);
    }

    localStorage.setItem('lastVisit', JSON.stringify(new Date().toLocaleString()));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('./consoleErrorLogger.js')
    }
  }, [])

  return (
    <main style={{ margin: '4vh auto' }} className="w-10/12 sm:w-8/12 md:w-1/2">
      <Suspense>
        <ErrorBoundary>
          <GameView setShowInstructionsModal={setShowInstructionsModal} />
        </ErrorBoundary>
      </Suspense>
      {showInstructionsModal && <InstructionsModal isOpen={showInstructionsModal} onClose={() => setShowInstructionsModal(false)} />}
    </main >
  );
}
