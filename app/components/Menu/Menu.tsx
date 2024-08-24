import { getLocalStorageOrDefault, setLocalStorageAndState } from '@/app/utils';
import React from 'react'

interface MenuProps {
  showMenu: boolean;
  setShowInstructionsModal: (value: boolean) => void;
  setShowArchiveModal: (value: boolean) => void;
}

export default function Menu({ showMenu, setShowInstructionsModal, setShowArchiveModal }: MenuProps) {
  const [includeUrl, setIncludeUrl] = React.useState(getLocalStorageOrDefault('includeUrl', true));

  if (showMenu) {
    return (
      <section className="flex flex-col gap-5 items-center w-full content-center text-black-pearl">
        <button className="py-2 px-4 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4 mt-36" onClick={() => setShowInstructionsModal(true)}>How to Play</button>
        <button className="py-2 px-4 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4" onClick={() => setShowArchiveModal(true)}>Archive</button>
        <div>
          <span className="text-s text-black-pearl text-opacity-70 dark:text-white">Include URL in clipboard</span>
          <input type="checkbox" className="ml-2" checked={includeUrl} onChange={(event) => setLocalStorageAndState('includeUrl', event.target.checked, setIncludeUrl)} />
        </div>
      </section>
    )
  } else {
    return null;
  }
}