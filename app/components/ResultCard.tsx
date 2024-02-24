import NumberIcon from "./NumberIcon";

export default function ResultCard(props: {
    index: number, 
    guess: string,
    list: string[],
}): JSX.Element {
    const getNumber = (guess: string): number => {
        return props.list.indexOf(guess);
    }
        
    return (
        <div key={props.index} className={`flex flex-row gap-4 items-center`}>
            <NumberIcon number={getNumber(props.guess)} />
            <p>{props.guess}</p>
        </div>
    );
}