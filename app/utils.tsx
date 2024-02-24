// 0 is incorrect, any other number is the rank guessed correctly
export const getScore = (guesses: string[], answers: string[]) => {
  return guesses.map((guess: string) => {
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