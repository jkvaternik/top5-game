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
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue));
  }
  return defaultValue;
}

export const setLocalStorageAndState = (key: string, newValue: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
  setter(newValue);
  localStorage.setItem(key, JSON.stringify(newValue));
}