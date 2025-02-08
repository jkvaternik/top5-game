import React, { useEffect, useState } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { RankedAnswer } from '@/app/hooks/useDailyPuzzle';
import { StringIcon } from './RankItem/Icon';

interface Props {
  incorrectAnswers: RankedAnswer[];
}

const IncorrectRankList = ({ incorrectAnswers }: Props) => {
  const [items, setItems] = useState<RankedAnswer[]>(incorrectAnswers);

  useEffect(() => {
    setItems(incorrectAnswers);
  }, [incorrectAnswers]);

  useEffect(() => {
    const isSorted = items.every((item, index) => {
      if (index === 0) return true;
      return items[index - 1].rank <= item.rank;
    });

    if (!isSorted) {
      const sortedItems = items.slice().sort((a, b) => a.rank - b.rank);
      setTimeout(() => setItems(sortedItems), 2000);
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
