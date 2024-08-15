import { Answer } from '../../hooks/useDailyPuzzle';
import { IncorrectRankItem, RankItem } from './RankItem/RankItem';

interface Props {
  guesses: string[];
  answers: Answer[];
  options?: Answer[];
  isGameOver: boolean;
}

const RankList = ({ guesses, answers, options, isGameOver }: Props) => {
  const getClassName = (wasGuessed: boolean) => {
    if (isGameOver) {
      return wasGuessed ? 'isCorrect' : 'incorrect'
    } else {
      return wasGuessed ? 'isCorrect' : ''
    }
  }
  const gridView = answers.map((answer, index) => {
    const wasGuessed = guesses.find(guess => answer.text.includes(guess)) !== undefined;
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

  const incorrectView = guesses.filter(guess => !answers.flatMap(a => a.text).includes(guess)).map((guess, i) => {
    return <IncorrectRankItem
      key={i}
      guess={guess}
      index={(options?.findIndex(o => o.text.includes(guess)) ?? 0) + 1}
      stat={options?.find(o => o.text.includes(guess))?.stat || ''}
      isCorrectOrGameOver={false}
      className={getClassName(true)}
    />
  }).reverse()

  return <>
    {gridView}
    {incorrectView.length > 0 ? <>
      <br></br>
      <div className='flex flex-row gap-3 text-nowrap items-end w-full overflow-scroll animate-fadeIn mb-12'>
        {incorrectView}
      </div>
    </>
      : null
    }
  </>
};

export default RankList;