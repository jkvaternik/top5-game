import { useState } from 'react';
import Downshift from 'downshift';
import Fuse from 'fuse.js';

const InputComponent = ({ items, handleGuess, isGameOver, guessHistory }) => {
  const [inputItems, setInputItems] = useState(items);
  const [inputValue, setInputValue] = useState(''); // Control inputValue explicitly
  const [isIncorrect, setIsIncorrect] = useState(false); // For controlling shake animation

  const fuse = new Fuse(items, {
    includeScore: true,
    threshold: 0.3,
  });

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value); // Update inputValue on change

    if (value) {
      const results = fuse.search(value);
      const matchedItems = results.map(result => result.item);
      setInputItems(matchedItems.slice(0, 5));
    } else {
      setInputItems([]);
    }
  };

  const downshiftOnChange = (selectedItem) => {
    const isCorrect = handleGuess(selectedItem);
    setInputValue(''); // Explicitly clear inputValue upon selection
    setIsIncorrect(!isCorrect);

    // close keyboard on mobile
    document.activeElement.blur();
  };

  return (
    <Downshift
      inputValue={inputValue} // Provide Downshift with the controlled inputValue
      onChange={downshiftOnChange}
      onInputValueChange={(inputValue, stateAndHelpers) => {
        // Optionally, handle additional logic here if needed
      }}
      itemToString={item => (item || '')}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => (
        <div {...getRootProps({}, { suppressRefError: true })} className='relative w-full text-dark-maroon'>
          <input
            {...getInputProps({
              placeholder: "Enter your guess here...",
              className: `bg-gray-50 border border-gray-300 text-base rounded-lg p-2 w-full mt-4 ${isIncorrect ? 'shake' : ''}`,
              disabled: isGameOver,
              onChange: handleInputChange, // Use the custom handler
              onAnimationEnd: () => setIsIncorrect(false),
            })}
          />
          <ul {...getMenuProps()} className={`absolute list-none m-0 p-0 z-10 w-full bg-white rounded-md shadow-lg mt-1 ${!isOpen && 'hidden'}`}>
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  key={index}
                  {...getItemProps({ index, item })}
                  className={`cursor-pointer p-2 ${highlightedIndex === index ? 'bg-gray-100' : 'bg-white'} ${guessHistory.includes(item) ? 'line-through' : ''}`}
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

export default InputComponent;
