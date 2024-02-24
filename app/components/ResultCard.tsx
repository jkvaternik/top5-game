import NumberIcon from "./NumberIcon";

export default function ResultCard({ index, guess, list } : {
  index: number,
  guess: string,
  list: string[],
}): JSX.Element {
  const isWrong = (guess: string): boolean => {
    return list.indexOf(guess) == -1;
  }
  // const getNumber = (guess: string): number => {
  //   return props.list.indexOf(guess);
  // }

  return (
    <div key={index} className={`flex flex-row gap-4 items-center`}>
      <NumberIcon number={index} isEmpty={guess.length == 0} isWrong={isWrong(guess)}/>
      <p>{guess}</p>
    </div>
  );
}