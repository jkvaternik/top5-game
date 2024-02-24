const basicColorRainbowBg = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400']

export default function NumberIcon({number, isEmpty, isWrong}: {
    number: number,
    isEmpty: boolean,
    isWrong: boolean,
}): JSX.Element {
    const isEmptyOrWrong = (isEmpty || isWrong);
    const getColor = () => {
        return !isEmptyOrWrong ? basicColorRainbowBg[number] : 'bg-gray-400';
    }
    return (
        <div className={`flex items-center justify-center h-12 w-12 ${getColor()} rounded-md`}>
            <div className="text-white font-bold text-xl sm:text-base">{number != -1 ? (number + 1) : 'X'}</div>
        </div>
    );
}