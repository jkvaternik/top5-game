const basicColorRainbowBg = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400']

export default function NumberIcon(props: {
    number: number,
}): JSX.Element {
    const getColor = () => {
        return props.number != -1 ? basicColorRainbowBg[props.number] : 'bg-gray-400';
    }
    return (
        <div className={`flex items-center justify-center h-12 w-12 ${getColor()} rounded-md`}>
            <div className="text-white font-bold text-xl">{props.number != -1 ? (props.number + 1) : 'X'}</div>
        </div>
    );
}