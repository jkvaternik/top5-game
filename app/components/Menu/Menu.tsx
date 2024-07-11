import React from 'react'

interface MenuProps {
  showMenu: boolean;
  setShowInstructionsModal: (value: boolean) => void;
  setShowArchiveModal: (value: boolean) => void;
}

export default function Menu({ showMenu, setShowInstructionsModal, setShowArchiveModal }: MenuProps) {
  if (showMenu) {
    return (
      <section className="flex flex-col gap-5 items-center w-full content-center text-dark-maroon">
        <button className="py-2 px-4 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4 mt-36" onClick={() => setShowInstructionsModal(true)}>How to Play</button>
        <button className="py-2 px-4 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4" onClick={() => setShowArchiveModal(true)}>Archive</button>
      </section>
    )
  } else {
    return null;
  }
}