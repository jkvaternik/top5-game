// 0 is incorrect, any other number is the rank guessed correctly
export const getScore = (guesses: string[], answers: string[]) => {
  return guesses.map((guess: string, index: number) => {
    const rank = answers.indexOf(guess);
    return rank === -1 ? 0 : rank + 1;
  })
}