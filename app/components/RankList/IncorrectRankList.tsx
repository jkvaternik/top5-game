import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { RankedAnswer } from '@/app/hooks/useDailyPuzzle';
import { StringIcon } from './RankItem/Icon';

interface Props {
  // list of incorrect answers in guess order (most recent last)
  incorrectAnswers: RankedAnswer[];
  // whether the user just guessed a wrong answer. used to animate the list.
  mostRecentWasIncorrect: boolean;
}

const IncorrectRankList = ({
  incorrectAnswers,
  mostRecentWasIncorrect,
}: Props) => {
  const isFirstRender = useRef(true);
  const prevIncorrectAnswers = useRef(incorrectAnswers);

  const items = useMemo(() => {
    if (
      isFirstRender.current ||
      !mostRecentWasIncorrect ||
      incorrectAnswers.length === 0
    ) {
      return [...incorrectAnswers].sort((a, b) => a.rank - b.rank);
    }
    return [
      incorrectAnswers[incorrectAnswers.length - 1],
      ...incorrectAnswers.slice(0, -1).sort((a, b) => a.rank - b.rank),
    ];
  }, [incorrectAnswers, mostRecentWasIncorrect]);

  const [sortedItems, setSortedItems] = useState(items);

  useEffect(() => {
    const answersChanged =
      prevIncorrectAnswers.current.length !== incorrectAnswers.length;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevIncorrectAnswers.current = incorrectAnswers;
      return;
    }

    if (answersChanged) {
      setSortedItems(items);
      prevIncorrectAnswers.current = incorrectAnswers;

      const isSorted = items.every(
        (item, index) => index === 0 || items[index - 1].rank <= item.rank
      );

      if (!isSorted) {
        const timeoutId = setTimeout(() => {
          setSortedItems([...items].sort((a, b) => a.rank - b.rank));
        }, 1500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [items, incorrectAnswers]);

  // Generate flipKey only if not first render
  const itemKeys = isFirstRender.current
    ? ''
    : sortedItems.map(i => i.text[0]).join('');

  return (
    <Flipper
      flipKey={itemKeys}
      className="flex flex-col gap-3"
      spring={{ stiffness: 300, damping: 30 }}
    >
      {sortedItems.map(guess => (
        <Flipped key={guess.text[0]} flipId={guess.text[0]}>
          <div className="flex flex-row gap-4 items-center text-black-pearl dark:text-white bg-white dark:bg-dark-purple">
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
        </Flipped>
      ))}
    </Flipper>
  );
};

export default React.memo(IncorrectRankList);
