import NumberIcon from "./NumberIcon";

export default function ResultCard({ index, guess } : {
  index: number,
  guess: string
}): JSX.Element {
  const isEmpty = guess.length == 0;
  return (
    <div key={index} className={`flex flex-row gap-4 items-center text-dark-maroon`}>
      <NumberIcon number={index} isEmpty={isEmpty}/>
      <p className={isEmpty ? 'animate-fade' : ''}>{guess}</p>
    </div>
  );
}