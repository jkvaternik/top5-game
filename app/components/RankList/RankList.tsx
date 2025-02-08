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

  const answersInGuessOrder = guesses.map(
    guess =>
      options?.find(o => o.text.includes(guess)) ?? {
        text: [guess],
        stat: null,
        rank: -1,
      }
  );

  let mostRecentWasIncorrect = false;
  if (guesses.length > 0) {
    const mostRecentGuess = guesses[guesses.length - 1];
    mostRecentWasIncorrect = !answers.find(a =>
      a.text.includes(mostRecentGuess)
    );
  }

  const incorrectAnswers = answersInGuessOrder.filter(
    answer => !answers.find(a => a.text.includes(answer.text[0]))
  );

  return (
    <>
      {gridView}
      {incorrectAnswers.length > 0 ? (
        <>
          <hr className="border-t-1 dark:border-gray-600 border-gray-400" />
          <IncorrectRankList
            incorrectAnswers={incorrectAnswers}
            mostRecentWasIncorrect={mostRecentWasIncorrect}
          />
        </>
      ) : null}
    </>
  );
};

export default RankList;
