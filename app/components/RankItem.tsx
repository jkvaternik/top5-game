import NumberIcon from "./NumberIcon";

export default function RankItem({ index, displayValue, className }: {
  index: number,
  displayValue: string,
  className?: string
}): JSX.Element {
  const isEmpty = displayValue.length == 0;
  return (
    <div key={index} className={`flex flex-row gap-4 items-center text-dark-maroon ${className}`}>
      <NumberIcon number={index} isEmpty={isEmpty} />
      <p className={isEmpty ? 'animate-fade' : ''}>{displayValue}</p>
    </div>
  );
}