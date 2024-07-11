import React from 'react';
import { Answer, puzzles } from "../../hooks/useDailyPuzzle";

import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { getCurrentLocalDateAsString } from '@/app/utils';

interface PickerProps {
  onClick: (key: string) => void;
}

const Picker = ({ onClick }: PickerProps) => {
  const arrayTo2DArray = (arr: any[], size: number) => {
    const arr2D = arr.reduce((acc, _, i) => {
      if (i % size === 0) {
        acc.push(arr.slice(i, i + size));
      }
      return acc;
    }, []);

    const lastRow = arr2D[arr2D.length - 1];
    const diff = size - lastRow.length;
    for (let i = 0; i < diff; i++) {
      lastRow.push(undefined);
    }

    return arr2D;
  }

  const arrayTo3DArray = (arr: any[], size: number) => {
    const arr2D = arrayTo2DArray(arr, size);
    const arr3D = arrayTo2DArray(arr2D, size);

    return arr3D;
  };

  const puzzleKeys = Object.keys(puzzles).filter((key: string) => Date.parse(key) <= Date.parse(getCurrentLocalDateAsString()));
  const puzzleMatrix = arrayTo3DArray(puzzleKeys, 5)

  const [index, setIndex] = React.useState(puzzleMatrix.length - 1);

  const isComplete = (key: string) => {
    if (typeof window !== 'undefined') {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue === null) return false;

      const guesses: string[] = JSON.parse(localStorageValue);
      const answers: string[] = puzzles[key].answers.flatMap((answer: Answer) => answer.text);

      const correctGuesses = guesses.filter((guess: string) => answers.includes(guess));
      const incorrectGuesses = guesses.filter((guess: string) => !answers.includes(guess));

      return correctGuesses.length === 5 || incorrectGuesses.length === 5;
    } else {
      return false;
    }
  }

  const isAttempted = (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) !== null;
    }
  }

  const getColor = (key: string) => {
    if (isComplete(key)) {
      return 'bg-[#D0DBF1] text-dark-maroon'
    }
    if (isAttempted(key)) {
      return 'border border-2 border-dashed border-[#B0C3E8] text-dark-maroon'
    } else {
      return 'border border-gray-200 text-dark-maroon'
    }
  }

  const isLeftEnabled = () => {
    return index !== 0;
  }

  const isRightEnabled = () => {
    return index !== puzzleMatrix.length - 1;
  }

  const getButtonSize = (label: string) => {
    switch (label.length) {
      case 1:
      case 2:
        return 'py-1.5 px-2';
      case 3:
        return 'py-1.5 px-1.5';
    }
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-4">
        {puzzleMatrix[index].map((row: string[] | undefined) => row && row.map((date: string) => {
          if (date !== undefined) {
            return (
              <div key={date} className={`flex justify-center items-center ${getColor(date)} rounded-md w-10 cursor-pointer`} onClick={() => onClick(date)}>
                <span className={`text-md ${getButtonSize(`${puzzles[date].num}`)} flex items-center justify-center`} unselectable='on'>{puzzles[date].num}</span>
              </div>
            )
          }
        }))}
      </div>
      <div className="flex flex-row justify-center mt-6">
        <ArrowLeftCircleIcon className={`h-10 w-10 text-[#304d6d] cursor-pointer ${isLeftEnabled() ? 'opacity-100' : 'opacity-50'}`} onClick={() => isLeftEnabled() ? setIndex(index - 1) : null} />
        <ArrowRightCircleIcon className={`h-10 w-10 text-[#304d6d] cursor-pointer ${isRightEnabled() ? 'opacity-100' : 'opacity-50'}`} onClick={() => isRightEnabled() ? setIndex(index + 1) : null} />
      </div>

    </div>
  )
}

export default Picker;