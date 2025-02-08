import { Answer, RankedAnswer } from '../../hooks/useDailyPuzzle';
import IncorrectRankList from './IncorrectRankList';
import { RankItem } from './RankItem/RankItem';

interface Props {
  guesses: string[];
  answers: Answer[];
  options?: RankedAnswer[];
  isGameOver: boolean;
}

const RankList = ({ guesses, answers, options, isGameOver }: Props) => {
  const getClassName = (wasGuessed: boolean) => {
    if (isGameOver) {
      return wasGuessed ? 'isCorrect' : 'incorrect';
    } else {
      return wasGuessed ? 'isCorrect' : '';
    }
  };
  const gridView = answers.map((answer, index) => {
    const wasGuessed =
      guesses.find(guess => answer.text.includes(guess)) !== undefined;
    return (
      <RankItem
        key={index}
        index={index}
        answer={answer}
        isCorrectOrGameOver={wasGuessed || isGameOver}
        className={getClassName(wasGuessed)}
      />
    );
  });

  const incorrectGuesses: RankedAnswer[] = guesses
    .filter(guess => !answers.flatMap(a => a.text).includes(guess))
    .map(
      guess =>
        options?.find(o => o.text.includes(guess)) ?? {
          text: [guess],
          stat: null,
          rank: -1,
        }
    );

  const sortedMinusLast = incorrectGuesses
    .slice(0, incorrectGuesses.length - 1)
    .sort((a, b) => a.rank - b.rank);

  const sortedIncorrectGuesses =
    incorrectGuesses.length > 0
      ? [incorrectGuesses[incorrectGuesses.length - 1], ...sortedMinusLast]
      : [];

  console.log(
    'Rank List incorrect guesses = ',
    sortedIncorrectGuesses.map(i => i.text).join(', ')
  );

  return (
    <>
      {gridView}
      <br></br>
      {incorrectGuesses.length > 0 ? (
        <IncorrectRankList incorrectAnswers={sortedIncorrectGuesses} />
      ) : null}
    </>
  );
};

export default RankList;
