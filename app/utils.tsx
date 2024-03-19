// 0 is incorrect, any other number is the rank guessed correctly
export const getScore = (guessHistory: string[], answers: string[]) => {
  return guessHistory.map((guess: string) => {
    const rank = answers.indexOf(guess);
    return rank === -1 ? 0 : rank + 1;
  })
}

export const getShareableEmojiScore = (score: number[]) => {
  const emojiScore = score.map((rank: number) => {
    if (rank === 0) {
      return '⬜';
    }
    return ['🟥', '🟧', '🟨', '🟩', '🟦'][rank - 1];
  }).join('');

  return emojiScore
}

// Game must be over when this is called
export const getScoreMessage = (score: number[]) => {
  const correctGuesses = score.filter(s => s !== 0).length;
  const incorrectGuesses = score.length - correctGuesses;
  if (incorrectGuesses === 0) {
    // Check if all guesses were guessed in order
    if (score.every((s, i) => s === i + 1)) {
      return 'Mastermind!';
    }

    return 'Perfect!';
  }
  if (correctGuesses === 0) {
    return 'You\'ll get it next time!';
  }
  switch (correctGuesses) {
    case 1:
      return 'Oof, tough one!';
    case 2:
      return 'Way to go!';
    case 3:
      return 'Nice one!';
    case 4:
      return 'Good job!';
    case 5:
      return 'Amazing!';
  }
}

export const getLocalStorageOrDefault = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    if (isNewDay()) {
      // clear for new day, we can update this if we want to store any stats
      // localStorage.clear();
      return defaultValue;
    }
    else {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      else {
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export const isNewDay = () => {
  if (typeof window !== 'undefined') {
    const lastVisitDate = localStorage.getItem('lastVisit');
    if (lastVisitDate === null) {
      return true;
    } else {
      return new Date(JSON.parse(lastVisitDate)).getDate() !== new Date().getDate();
    }
  }
}

export const setLocalStorageAndState = (key: string, newValue: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
  setter(newValue);
  localStorage.setItem(key, JSON.stringify(newValue));
}

export const isNewVisitor = () => {
  if (typeof window !== 'undefined') {
    const lastVisitDate = localStorage.getItem('lastVisit');
    if (lastVisitDate === null) {
      return true;
    }
    return false;
  }
}
