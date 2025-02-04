import { getLocalStorageOrDefault, setLocalStorageAndState } from '@/app/utils';
import React from 'react';
import Switch from './Switch';

interface MenuProps {
  showMenu: boolean;
  setShowInstructionsModal: (value: boolean) => void;
  setShowArchiveModal: (value: boolean) => void;
}

export default function Menu({
  showMenu,
  setShowInstructionsModal,
  setShowArchiveModal,
}: MenuProps) {
  const [includeUrl, setIncludeUrl] = React.useState(
    getLocalStorageOrDefault('includeUrl', true)
  );

  if (showMenu) {
    return (
      <section className="flex flex-col gap-5 w-full items-center content-center text-black-pearl">
        <button
          className="py-2 px-4 bg-[#304d6d] dark:bg-[#4F6479] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4 mt-36"
          onClick={() => setShowInstructionsModal(true)}
        >
          How to Play
        </button>
        <button
          className="py-2 px-4 bg-[#304d6d] dark:bg-[#4F6479] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4"
          onClick={() => setShowArchiveModal(true)}
        >
          Archive
        </button>
        <div className="w-3/4 flex justify-between">
          <p className="text-s text-black-pearl text-opacity-70 dark:text-white">
            Include URL in clipboard
          </p>
          <Switch
            isChecked={includeUrl}
            onChange={checked =>
              setLocalStorageAndState('includeUrl', checked, setIncludeUrl)
            }
          />
        </div>
      </section>
    );
  } else {
    return null;
  }
}
