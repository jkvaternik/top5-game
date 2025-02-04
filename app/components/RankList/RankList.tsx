import { Answer, RankedAnswer } from '../../hooks/useDailyPuzzle';
import { IncorrectRankItem, RankItem } from './RankItem/RankItem';

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

  const incorrectView = incorrectGuesses
    .sort((a, b) => b.rank - a.rank)
    .map((guess, i) => {
      return (
        <IncorrectRankItem
          key={i}
          guess={guess.text[0]}
          index={guess.rank}
          stat={guess.stat ?? ''}
          isCorrectOrGameOver={false}
        />
      );
    })
    .reverse();

  return (
    <>
      {gridView}
      {incorrectView.length > 0 ? (
        <>
          <div className="flex flex-col gap-3 text-nowrap w-full overflow-scroll animate-fadeIn mt-2 mb-8">
            {incorrectView}
          </div>
        </>
      ) : null}
    </>
  );
};

export default RankList;
