import { Answer } from '../hooks/useDailyPuzzle';
import RankItem from './RankItem';

interface Props {
  guesses: string[];
  answers: Answer[];
  isGameOver: boolean;
}

const RankList = ({ guesses, answers, isGameOver }: Props) => {
  if (isGameOver) {
    return answers.map((answer, index) => (
      <RankItem
        key={index}
        index={index}
        answer={answer}
        className={`${answers.map(a => a.text)[index].includes(guesses[index]) ? 'incorrect' : ''}`}
      />
    ));
  }
  return guesses.map((guess, index) => {
      const answer = answers.find(a => a.text.includes(guess));
      return (
        <RankItem
          key={index}
          index={index}
          answer={answer}
          className={`${answer && answers.map(a => a.text)[index].includes(guesses[index]) ? 'incorrect' : ''}`}
        />
      );
    })
};

export default RankList;