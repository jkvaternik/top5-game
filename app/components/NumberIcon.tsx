const basicColorRainbowBg = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400']

export default function NumberIcon({ number, isEmpty }: {
  number: number,
  isEmpty: boolean,
}): JSX.Element {
    const styles: React.CSSProperties = { position: 'absolute', width: '100%', height: '100%', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' };
    const getColor = () => {
        return !isEmpty ? basicColorRainbowBg[number] : 'bg-gray-400';
    }
    return (
        <div className={`h-12 w-12 shrink-0`}>
            <div
                className="flex items-center justify-center text-white font-bold text-xl sm:text-base rounded-md"
                style={{ 'position': 'relative', 'width': '100%', 'height': '100%', 'transition': 'transform 0.8s', 'transformStyle': 'preserve-3d', transform: (!isEmpty ? 'rotateX(180deg)' : '') }}>
                <div
                    id="flip-front"
                    style={styles}
                    className={`flex items-center justify-center rounded-md bg-gray-400`}>
                    {(number + 1)}
                </div>
                <div
                    id="flip-back"
                    style={{...styles, 'transform': 'rotateX(180deg)' }}
                    className={`flex items-center justify-center rounded-md ${getColor()}`}>
                    {(number + 1)}
                </div>
            </div>
        </div>
        <div
          id="flip-back"
          style={{ ...styles, 'transform': 'rotateX(180deg)' }}
          className={`flex items-center justify-center rounded-md ${getColor()}`}>
          {(number + 1)}
        </div>
      </div>
    </div>
  );
}