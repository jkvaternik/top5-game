import React, { useReducer, useCallback, useEffect, useMemo } from 'react';
import Downshift from 'downshift';
import { debounce } from 'lodash';

const initialState = {
  inputValue: '',
  inputItems: [],
  isIncorrect: false,
};

function inputReducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return {
        ...state,
        inputValue: action.payload.inputValue,
        inputItems: action.payload.inputItems,
      };
    case 'SET_INCORRECT':
      return {
        ...state,
        isIncorrect: action.payload,
      };
    case 'RESET_INPUT':
      return {
        ...state,
        inputValue: '',
        isIncorrect: action.payload.isIncorrect,
      };
    default:
      return state;
  }
}

const InputComponent = ({ items, handleGuess, isGameOver, guesses, answers }) => {
  const [state, dispatch] = useReducer(inputReducer, initialState);

  // Search function with useCallback to prevent unnecessary re-creations
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

  // Debounced search function wrapped in useCallback
  const debouncedSearch = useCallback(
    debounce((value) => {
      const results = value ? searchItems(value) : [];
      dispatch({
        type: 'SET_INPUT',
        payload: {
          inputValue: value,
          inputItems: results,
        },
      });
    }, 100),
    [searchItems]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = useCallback((event) => {
    const value = event.target.value;
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleSelect = useCallback((selectedItem) => {
    if (selectedItem) {
      const isCorrect = handleGuess(selectedItem);
      dispatch({ type: 'RESET_INPUT', payload: { isIncorrect: !isCorrect } });
      document.activeElement?.blur();
    }
  }, [handleGuess]);

  const strikethroughSet = useMemo(() => {
    const allAnswers = answers.flatMap(answer => answer.text);
    const correctAnswers = allAnswers.filter(option => guesses.includes(option));
    return new Set([...guesses, ...correctAnswers]);
  }, [answers, guesses]);

  const shouldStrikethrough = useCallback((item) => strikethroughSet.has(item), [strikethroughSet]);

  const handleAnimationEnd = useCallback(() => {
    dispatch({ type: 'SET_INCORRECT', payload: false });
  }, []);

  return (
    <Downshift
      inputValue={state.inputValue}
      onChange={handleSelect}
      itemToString={(item) => (item ? item : '')}
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
              className: `border border-gray-300 text-base rounded-md py-2 px-4 w-full mt-4 ${state.isIncorrect ? 'shake' : ''}`,
              disabled: isGameOver,
              onChange: handleInputChange,
              onAnimationEnd: handleAnimationEnd
            })}
          />
          <ul {...getMenuProps()} className={`absolute list-none m-0 p-0 z-10 w-full bg-white rounded-lg shadow-lg mt-1 ${!isOpen && 'hidden'}`}>
            {isOpen && state.inputItems.map((item, index) => (
              <li
                key={item + index}
                {...getItemProps({
                  index,
                  item,
                  className: `cursor-pointer p-2 ${highlightedIndex === index ? 'bg-gray-100' : ''} ${shouldStrikethrough(item) ? 'line-through text-gray-400' : ''}`
                })}
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
