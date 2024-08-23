import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Downshift from 'downshift';
import { debounce } from 'lodash';

const InputComponent = ({ items, handleGuess, isGameOver, guesses, answers }) => {
  const [inputItems, setInputItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);

  // Search function
  const searchItems = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    return items
      .filter(item => item.toLowerCase().includes(lowercaseQuery))
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        if (aLower === lowercaseQuery) return -1;
        if (bLower === lowercaseQuery) return 1;
        return aLower.indexOf(lowercaseQuery) - bLower.indexOf(lowercaseQuery) || aLower.localeCompare(bLower);
      })
      .slice(0, 5);
  }, [items]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      if (value) {
        const results = searchItems(value);
        setInputItems(results);
      } else {
        setInputItems([]);
      }
    }, 100),
    [searchItems]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = useCallback((event) => {
    const { value } = event.target;
    setInputValue(value);
    if (value) {
      debouncedSearch(value);
    } else {
      setInputItems([]);
    }
  }, [debouncedSearch]);

  const downshiftOnChange = useCallback((selectedItem) => {
    if (selectedItem) {
      const isCorrect = handleGuess(selectedItem);
      setInputValue('');
      setIsIncorrect(!isCorrect);
      document.activeElement?.blur();
    }
  }, [handleGuess]);

  const strikethroughSet = useMemo(() => {
    const allAnswers = answers.flatMap(answer => answer.text);
    const correctAnswers = allAnswers.filter(option => guesses.includes(option));
    return new Set([...guesses, ...correctAnswers]);
  }, [answers, guesses]);

  const shouldStrikethrough = useCallback((item) =>
    strikethroughSet.has(item)
    , [strikethroughSet]);

  const handleAnimationEnd = useCallback(() => setIsIncorrect(false), []);

  return (
    <Downshift
      inputValue={inputValue}
      onChange={downshiftOnChange}
      itemToString={(item) => item || ''}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        getRootProps,
      }) => (
        <div {...getRootProps({}, { suppressRefError: true })} className='relative w-full text-dark-maroon'>
          <input
            {...getInputProps({
              placeholder: "Enter your guess here...",
              className: `border border-gray-300 text-base rounded-md py-2 px-4 w-full mt-4 ${isIncorrect ? 'shake' : ''}`,
              disabled: isGameOver,
              onChange: handleInputChange,
              onAnimationEnd: handleAnimationEnd,
            })}
          />
          <ul {...getMenuProps()} className={`absolute list-none m-0 p-0 z-10 w-full bg-white rounded-lg shadow-lg mt-1 ${!isOpen && 'hidden'}`}>
            {isOpen && inputItems.map((item, index) => (
              <li
                key={`${item}-${index}`}
                {...getItemProps({
                  index,
                  item
                })}
                className={`cursor-pointer p-2 ${highlightedIndex === index ? 'bg-gray-100' : ''
                  } ${shouldStrikethrough(item) ? 'line-through text-gray-400' : ''}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default React.memo(InputComponent);