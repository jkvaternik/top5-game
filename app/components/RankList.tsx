import { Answer } from '../hooks/useDailyPuzzle';
import RankItem from './RankItem';

interface Props {
  guesses: string[];
  answers: Answer[];
  isGameOver: boolean;
  onGoToArchive: () => void;
}

const RankList = ({ guesses, answers, isGameOver, onGoToArchive }: Props) => {
  if (isGameOver) {
    return <>
    {answers.map((answer, index) => (
      <RankItem
        key={index}
        index={index}
        answer={answer}
        className={`${answers.map(a => a.text)[index].includes(guesses[index]) ? '' : 'incorrect'}`}
      />))}
      <button onClick={() => onGoToArchive()} className="py-2 px-4 bg-[#946969] text-white font-medium rounded hover:bg-[#ad8b8b] w-full mt-6">Go to Archive</button>
    </>;
  }
  return guesses.map((guess, index) => {
    const answer = answers.find(a => a.text.includes(guess));
    const isCorrect = answer && answers.map(a => a.text)[index].includes(guess);
    return (
      <RankItem
        key={index}
        index={index}
        answer={answer}
        className={`${isCorrect ? '' : 'isCorrect'}`}
      />
    );
  })
};

export default RankList;