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

export const getLocalStorageOrDefault = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    if (isNewDay()) {
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