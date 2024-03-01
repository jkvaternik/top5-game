import RankItem from './RankItem';

interface Props {
  guesses: string[];
  answers: string[];
  isGameOver: boolean;
}

const RankList = ({ guesses, answers, isGameOver }: Props) => {
  if (isGameOver) {
    return answers.map((answer, index) => (
      <RankItem
        key={index}
        index={index}
        displayValue={answer}
        className={`${guesses[index] !== answers[index] ? 'incorrect' : ''}`}
      />
    ));
  }

  return guesses.map((guess, index) => (<RankItem key={index} index={index} displayValue={guess} />));
};

export default RankList;