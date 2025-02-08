import React, { useEffect, useState } from 'react';
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
  const [items, setItems] = useState<RankedAnswer[]>(incorrectAnswers);

  useEffect(() => {
    // if most recent was incorrect, put the last guess at the top of the items and sort all others
    if (mostRecentWasIncorrect) {
      setItems([
        incorrectAnswers[incorrectAnswers.length - 1],
        ...incorrectAnswers.slice(0, -1).sort((a, b) => a.rank - b.rank),
      ]);
    } else {
      // if most recent was correct, sort all incorrect answers (no need to animate)
      setItems(incorrectAnswers.slice().sort((a, b) => a.rank - b.rank));
    }
  }, [incorrectAnswers, mostRecentWasIncorrect]);

  useEffect(() => {
    // when items change, if they are not sorted, set a timeout to sort them
    const sorted = items.every(
      (item, index) => index === 0 || items[index - 1].rank <= item.rank
    );

    if (!sorted) {
      setTimeout(() => {
        const sortedItems = items.slice().sort((a, b) => a.rank - b.rank);
        setItems(sortedItems);
      }, 1500);
    }
  }, [items]);

  const itemKeys = items.map(i => i.text[0]).join('');
  return (
    <div className="relative w-full mb-8">
      <div className="flex flex-col text-nowrap w-full relative">
        <Flipper flipKey={itemKeys}>
          {items.map((guess, index) => {
            return (
              <Flipped key={guess.text[0]} flipId={guess.text[0]}>
                <div
                  key={guess.text[0] + '-div'}
                  className={`
                            flex flex-nowrap flex-row gap-4 rounded-md
                            items-center text-black-pearl dark:text-white
                            bg-white dark:bg-dark-purple
                          `}
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
              </Flipped>
            );
          })}
        </Flipper>
      </div>
    </div>
  );
};

export default IncorrectRankList;
