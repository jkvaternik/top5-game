const basicColorRainbowBg = [
  'bg-red-500',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-green-500',
  'bg-blue-500',
];

export function NumberIcon({
  number,
  isEmpty,
}: {
  number: number;
  isEmpty: boolean;
}): JSX.Element {
  const styles: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
  };
  const getColor = () => {
    return !isEmpty
      ? basicColorRainbowBg[number]
      : 'bg-gray-400 dark:bg-gray-600';
  };
  return (
    <div className={`h-12 w-12 shrink-0`}>
      <div
        className={`flex items-center justify-center text-white font-bold  sm:text-base md:text-xl rounded-md`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.8s',
          transformStyle: 'preserve-3d',
          transform: !isEmpty ? 'rotateX(180deg)' : '',
        }}
      >
        <div
          id="flip-front"
          style={styles}
          className={`flex items-center justify-center rounded-md bg-gray-400 dark:bg-gray-600 sm:text-base md:text-xl`}
        >
          {number + 1}
        </div>
        <div
          id="flip-back"
          style={{ ...styles, transform: 'rotateX(180deg)' }}
          className={`flex items-center justify-center rounded-md ${getColor()} sm:text-base md:text-xl`}
        >
          {number + 1}
        </div>
      </div>
    </div>
  );
}

export function StringIcon({
  string,
  isEmpty,
}: {
  string: string;
  isEmpty: boolean;
}): JSX.Element {
  const styles: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
  };

  return (
    <div className={`h-12 w-12 shrink-0`}>
      <div
        className={`flex items-center justify-center text-white font-bold sm:text-base md:text-xl rounded-md`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.8s',
          transformStyle: 'preserve-3d',
          transform: !isEmpty ? 'rotateX(180deg)' : '',
        }}
      >
        <div
          id="flip-front"
          style={styles}
          className={`flex items-center justify-center rounded-md border-2 border-solid border-gray-500 text-gray-500 dark:border-gray-200 dark:text-gray-200`}
        >
          {string}
        </div>
      </div>
    </div>
  );
}
