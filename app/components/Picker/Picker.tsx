import React, { useState, useEffect } from 'react';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { getCurrentLocalDateAsString } from '@/app/utils';
import { Answer, Puzzle } from '@/app/hooks/useDailyPuzzle';
import { fetchAllPuzzles } from '@/app/services/services';

interface PickerProps {
  onClick: (key: string) => void;
}

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

const Picker = ({ onClick }: PickerProps) => {
  const [puzzles, setPuzzles] = useState<Puzzle[] | null>();
  const [puzzleMatrix, setPuzzleMatrix] = useState<Puzzle[][][]>([]);
  const [index, setIndex] = useState(0);
  const currentDate = getCurrentLocalDateAsString();

  useEffect(() => {
    fetchAllPuzzles((puzzles: Puzzle[] | null) => {
      setPuzzles(puzzles);
      if (puzzles) {
        const filteredPuzzles = puzzles.filter(puzzle => Date.parse(puzzle.date!!) <= Date.parse(currentDate));
        const pMatrix = arrayTo3DArray(filteredPuzzles, 5);
        setPuzzleMatrix(pMatrix);
        setIndex(pMatrix.length - 1);
      }
    });
  }, [currentDate]);

  if (!puzzles) return null;

  const isComplete = (puzzle: Puzzle) => {
    if (typeof window !== 'undefined') {
      const localStorageValue = localStorage.getItem(puzzle.date!!);
      if (localStorageValue === null) return false;

      const guesses: string[] = JSON.parse(localStorageValue);
      const answers: string[] = puzzle.answers.flatMap((answer: Answer) => answer.text);

      const correctGuesses = guesses.filter((guess: string) => answers.includes(guess));
      const incorrectGuesses = guesses.filter((guess: string) => !answers.includes(guess));

      return correctGuesses.length === 5 || incorrectGuesses.length === 5;
    } else {
      return false;
    }
  }

  const isAttempted = (puzzle: Puzzle) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(puzzle.date!!) !== null;
    }
  }

  const getColor = (puzzle: Puzzle) => {
    if (isComplete(puzzle)) {
      return 'bg-[#D0DBF1] text-dark-maroon'
    }
    if (isAttempted(puzzle)) {
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
        {puzzleMatrix[index]?.map((row: Puzzle[] | undefined) => row && row.map((puzzle: Puzzle) => {
          if (puzzle) {
            return (
              <div key={puzzle.date} className={`flex justify-center items-center ${getColor(puzzle)} rounded-md w-10 cursor-pointer select-none`} onClick={() => onClick(puzzle.date!!)}>
                <span className={`text-md ${getButtonSize(`${puzzle.num}`)} flex items-center justify-center`}>{puzzle.num}</span>
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