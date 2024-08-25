import { useState } from 'react';
import Downshift from 'downshift';
import Fuse from 'fuse.js';

const InputComponent = ({ items, handleGuess, isGameOver, guesses, answers }) => {
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

  const shouldStrikethrough = (item) => {
    const allAnswers = answers.map(answer => answer.text)
    const correctAnswers = allAnswers.filter(options => options.some(option => guesses.includes(option))).flat()

    return guesses.includes(item) || correctAnswers.includes(item)
  }

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
        <div {...getRootProps({}, { suppressRefError: true })} className='relative w-full text-black-pearl'>
          <input
            {...getInputProps({
              placeholder: "Enter your guess here...",
              className: `border border-gray-300 dark:border-[#4B585E] text-base rounded-md py-2 px-4 w-full mt-4 ${isIncorrect ? 'shake' : ''} dark:bg-dark-purple dark:text-white`,
              disabled: isGameOver,
              onChange: handleInputChange, // Use the custom handler
              onAnimationEnd: () => setIsIncorrect(false),
            })}
          />
          <ul {...getMenuProps()} className={`absolute list-none m-0 p-0 z-10 w-full bg-white dark:bg-dark-purple dark:text-white rounded-lg shadow-lg mt-0 ${!isOpen && 'hidden'}`}>
            {isOpen &&
              inputItems.filter(item => !shouldStrikethrough(item)).map((item, index) => (
                <li
                  key={index}
                  {...getItemProps({ index, item })}
                  className={`rounded-md cursor-pointer p-2 ${highlightedIndex === index ? 'bg-gray-100 dark:bg-[#18283B] dark:text-white' : 'bg-white dark:bg-dark-purple dark:text-white'}`}
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
