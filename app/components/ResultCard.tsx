export default function ResultCard(props: {
    key: number, 
    guess: string,
    list: string[],
}): JSX.Element {
    const basicColorRainbow = ['red', 'orange', 'yellow', 'green', 'blue']
    const getColor = () => {
        return props.list.indexOf(props.guess) !== -1 ? basicColorRainbow[props.list.indexOf(props.guess)] : 'gray';
    }
    const getNumberOrNull = (guess: string): string => {
        const index = props.list.indexOf(guess);
        if (index === -1) {
            return 'X';
        }
        return (index + 1).toString();
    }
        
    return (
        <div key={props.key} className={`flex flex-row gap-4 text-${getColor()}-500`}>
            <div>{getNumberOrNull(props.guess)}</div>
            <p>{props.guess}</p>
        </div>
    );
}