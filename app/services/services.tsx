import { Puzzle } from "../hooks/useDailyPuzzle";
import { getCurrentLocalDateAsString } from "../utils";

export const fetchPuzzle = async (day: string | null, setPuzzle: (data: Puzzle | null) => void) => {
  let puzzleDay = day || getCurrentLocalDateAsString();
  try {
    const response = await fetch(`/api/puzzle?date=${puzzleDay}`);
    if (!response.ok) {
      throw new Error('Failed to fetch puzzle');
    }
    const data = await response.json();
    setPuzzle(data);
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    setPuzzle(null);
  }
};

export const fetchAllPuzzles = async (setPuzzles: (data: Puzzle[] | null) => void) => {
  try {
    const response = await fetch(`/api/puzzles`);
    if (!response.ok) {
      throw new Error('Failed to fetch puzzles');
    }
    const data = await response.json();
    setPuzzles(data);
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    setPuzzles(null);
  }
}

export const fetchOptions = async (key: string, setOptions: (data: string[] | null) => void) => {
  try {
    const response = await fetch(`/api/options?optionsKey=${key}`);
    if (!response.ok) {
      throw new Error('Failed to fetch options');
    }
    const data = await response.json();
    setOptions(data);
  } catch (error) {
    console.error('Error fetching options:', error);
    setOptions(null);
  }
}