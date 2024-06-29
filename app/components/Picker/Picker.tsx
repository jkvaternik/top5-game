import React from 'react';
import { puzzles } from "../../hooks/useDailyPuzzle";

import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { Puzzle } from '@/app/hooks/useDailyPuzzle';

interface PickerProps {
  items: Puzzle[];
}

const Picker = () => {
  const [index, setIndex] = React.useState(0);

  const isComplete = (key: string) => isAttempted(key)

  const isAttempted = (key: string) => localStorage.getItem(key) !== null

  const getColor = (key: string) => {
    if (isAttempted(key)) {
      return 'border border-amber-600 text-dark-maroon'
    }
    if (isComplete(key)) {
      return 'bg-green-600 text-white'
    } else {
      return 'border border-gray-200 text-dark-maroon'
    }
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

    console.log(arr2D);
    return arr2D;
  }

  const arrayTo3DArray = (arr: any[], size: number) => {
    const arr2D = arrayTo2DArray(arr, size);
    const arr3D = arrayTo2DArray(arr2D, size);

    return arr3D;
  };

  const puzzleMatrix = arrayTo3DArray(Object.keys(puzzles), 4)
  
  const isLeftEnabled = () => {
    return index !== 0;
  }

  const isRightEnabled = () => {
    return index !== puzzleMatrix.length - 1;
  }

  const getButtonSize = (label: string) => {
    switch (label.length) {
      case 1:
        return 'py-2 px-3';
      case 2:
        return 'py-2 px-2.5';
      case 3:
        return 'py-2 px-1.5';
    }
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {puzzleMatrix[index].map((row: string[]) => row.map((date: string) => {
          if (date !== undefined) {
            return (
              <div key={date} className={`flex justify-center items-center ${getColor(date)} rounded-full`}>
              <span className={`text-md ${getButtonSize(`${puzzles[date].num}`)} flex items-center justify-center`}>{puzzles[date].num}</span>
              </div>
            )
          }
        }))}
      </div>
      <div className="flex flex-row justify-center mt-6">
      <ArrowLeftCircleIcon className={`h-8 w-8 text-[#304d6d] cursor-pointer ${isLeftEnabled() ? 'opacity-100' : 'opacity-50'}`} onClick={() => isLeftEnabled() ? setIndex(index - 1) : null } />
      <ArrowRightCircleIcon className={`h-8 w-8 text-[#304d6d] cursor-pointer ${isRightEnabled() ? 'opacity-100': 'opacity-50'}`} onClick={() => isRightEnabled() ? setIndex(index + 1) : null}  />
      </div>
      
    </div>
  )
}

export default Picker;