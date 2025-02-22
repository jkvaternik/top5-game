import { getLocalStorageOrDefault, setLocalStorageAndState } from '@/app/utils';
import React from 'react';
import Switch from './Switch';
import Button from '../Button';

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
        <Button
          styles="w-3/4 mt-36"
          onClick={() => setShowInstructionsModal(true)}
        >
          How to Play
        </Button>
        <Button styles="w-3/4" onClick={() => setShowArchiveModal(true)}>
          Archive
        </Button>
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
