// import React, { useEffect, useState } from 'react';
// import { RankedAnswer } from '@/app/hooks/useDailyPuzzle';
// import { StringIcon } from './RankItem/Icon';

// interface Props {
//   newIncorrectGuess: RankedAnswer;
//   incorrectAnswers: RankedAnswer[];
// }

// const IncorrectRankList = ({ newIncorrectGuess, incorrectAnswers }: Props) => {
//   const [items, setItems] = useState<RankedAnswer[]>(incorrectAnswers);
//   const [newItem, setNewItem] = useState<RankedAnswer | null>(null);
//   const [shouldAnimate, setShouldAnimate] = useState(false);
//   const itemHeight = 64;

//   useEffect(() => {
//     const addItemTimer = setTimeout(() => {
//       setNewItem(newIncorrectGuess);
//       setItems(prev => [newIncorrectGuess, ...prev]);
//     }, 1000);

//     const sortTimer = setTimeout(() => {
//       setShouldAnimate(true);
//       setItems(prev => [...prev].sort((a, b) => a.rank - b.rank));
//     }, 2000);

//     const removeNewTimer = setTimeout(() => {
//       setNewItem(null);
//     }, 4000);

//     return () => {
//       clearTimeout(addItemTimer);
//       clearTimeout(sortTimer);
//       clearTimeout(removeNewTimer);
//     };
//   }, [newIncorrectGuess, incorrectAnswers]);

//   return (
//     <div className="relative w-full mb-8"> {/* Added relative positioning */}
//       <div className="flex flex-col gap-3 text-nowrap w-full">
//         {items.map((guess, index) => { // Changed to use items instead of incorrectAnswers
//           const isNewItem = newItem?.text === guess.text;
//           const itemPosition = items.findIndex(i => i.text === guess.text);

//           return (
//             <div
//               key={`${guess.text}${index}`}
//               className="flex flex-nowrap flex-row gap-4 rounded-md p-2 border border-gray-400 dark:border-gray-400 border-dashed items-center text-black-pearl dark:text-white"
//               style={{
//                 position: 'absolute',
//                 width: '100%',
//                 height: itemHeight,
//                 opacity: 1,
//                 transform: isNewItem && !shouldAnimate
//                   ? 'translateY(0)'
//                   : `translateY(${index * (itemHeight + 12)}px)`, // Adjusted for gap-3
//                 transition: isNewItem
//                   ? 'transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)'
//                   : `all 800ms cubic-bezier(0.4, 0, 0.2, 1) ${itemPosition * 50}ms`,
//               }}
//             >
//               <StringIcon
//                 string={guess.rank === -1 ? 'X' : `${guess.rank}`}
//                 isEmpty={true}
//               />
//               <div>
//                 <p className="text-gray-700 dark:text-white font-base">
//                   {guess.text}
//                 </p>
//                 <p className="text-gray-700 dark:text-white font-base text-opacity-70">
//                   {guess.stat}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       {/* Add spacer div for container height */}
//       <div style={{ height: `${items.length * (itemHeight + 12)}px` }} />
//     </div>
//   );
// };

// export default IncorrectRankList;

import React, { useEffect, useState } from 'react';
import { RankedAnswer } from '@/app/hooks/useDailyPuzzle';
import { StringIcon } from './RankItem/Icon';

interface Props {
  newIncorrectGuess: RankedAnswer;
  incorrectAnswers: RankedAnswer[];
}

const IncorrectRankList = ({ newIncorrectGuess, incorrectAnswers }: Props) => {
  const [items, setItems] = useState<RankedAnswer[]>(incorrectAnswers);
  const [newItem, setNewItem] = useState<RankedAnswer | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const itemHeight = 64;

  // Reset animation states when new guess comes in
  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const animationKey = `rankList_animated_${today}_${newIncorrectGuess.text}`;

    // Clean up old animation flags (from previous days)
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('rankList_animated_') && !key.includes(today)) {
        sessionStorage.removeItem(key);
      }
    });

    const hasAnimated = sessionStorage.getItem(animationKey);

    if (!hasAnimated) {
      const addItemTimer = setTimeout(() => {
        setNewItem(newIncorrectGuess);
        setItems(prev => [newIncorrectGuess, ...prev]);
      }, 100);

      const sortTimer = setTimeout(() => {
        setShouldAnimate(true);
        sessionStorage.setItem(animationKey, 'true');
        setItems(prev => [...prev].sort((a, b) => a.rank - b.rank));
      }, 2000);

      return () => {
        clearTimeout(addItemTimer);
        clearTimeout(sortTimer);
      };
    } else {
      // Already animated today, just show sorted list
      setItems(
        [...incorrectAnswers, newIncorrectGuess].sort((a, b) => a.rank - b.rank)
      );
    }
  }, [newIncorrectGuess, incorrectAnswers]);

  return (
    <div className="relative w-full mb-8">
      <div className="flex flex-col gap-3 text-nowrap w-full relative">
        {items.map((guess, index) => {
          const isNewItem = newItem?.text === guess.text;
          const itemPosition = items.findIndex(i => i.text === guess.text);

          return (
            <div
              key={guess.text[0]}
              className={`
                flex flex-nowrap flex-row gap-4 rounded-md 
                ${isNewItem ? `p-2 border border-gray-400 dark:border-gray-400 border-dashed` : ``}
                items-center text-black-pearl dark:text-white
                bg-white
              `}
              style={{
                position: 'absolute',
                width: '100%',
                height: itemHeight,
                opacity: 1,
                transform:
                  isNewItem && !shouldAnimate
                    ? 'translateY(0)'
                    : `translateY(${index * (itemHeight + 12)}px)`,
                transition: isNewItem
                  ? 'transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : `all 800ms cubic-bezier(0.4, 0, 0.2, 1) ${
                      itemPosition * 50
                    }ms`,
                willChange: 'transform',
              }}
            >
              <StringIcon
                string={guess.rank === -1 ? 'X' : `${guess.rank}`}
                isEmpty={true}
              />
              <div>
                <p className="text-gray-700 dark:text-white font-base">
                  {guess.text}
                </p>
                <p className="text-gray-700 dark:text-white font-base text-opacity-70">
                  {guess.stat}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Spacer div with added padding for gap */}
      <div style={{ height: `${items.length * (itemHeight + 12)}px` }} />
    </div>
  );
};

export default IncorrectRankList;
