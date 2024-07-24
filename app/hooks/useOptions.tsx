import { useEffect, useState } from 'react';
import { fetchOptions } from '../services/services';
import { Puzzle } from './useDailyPuzzle';

const useOptions: (puzzle: Puzzle) => string[] | null = (puzzle: Puzzle) => {
  const [options, setOptions] = useState<string[] | null>([]);
  useEffect(() => {
    fetchOptions(puzzle.optionsKey, setOptions);
  }, [puzzle]);

  return options;
}

export default useOptions;