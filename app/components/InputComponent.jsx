import { useState } from 'react';
import Downshift from 'downshift';
import Fuse from 'fuse.js';

const InputComponent = ({ items, handleGuess, isGameOver }) => {
  const [inputItems, setInputItems] = useState(items);
  const [inputValue, setInputValue] = useState('');

  const fuse = new Fuse(items, {
    includeScore: true,
    threshold: 0.3, // Adjust this value based on your needs for fuzziness
  });

  const handleInputChange = (event) => {
    const { value } = event.target;
    const results = fuse.search(value);
    const matchedItems = results.map(result => result.item);
    setInputItems(matchedItems.slice(0, 5));
    setInputValue(value);
  };

  const downshiftOnChange = (selectedItem) => {
    handleGuess(selectedItem);
    setInputValue(''); // Clear the input value when an item is selected
  };

  return (
    <Downshift
      inputValue={inputValue}
      onChange={downshiftOnChange}
      itemToString={item => (item || '')} // Directly return the string item
      onInputValueChange={(inputValue) => handleInputChange({ target: { value: inputValue } })}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
      }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: "Enter your guess here...",
              className: "relative bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg p-2 w-full mt-4",
              disabled: isGameOver,
            })}
          />
          <ul {...getMenuProps()} className={`list-none m-0 p-0 absolute z-10 w-full bg-white rounded-md shadow-lg mt-1 ${!isOpen && 'hidden'}`}>
            {isOpen
              ? inputItems
                .map((item, index) => (
                  <li
                    key={index}
                    {...getItemProps({ key: index, index, item })}
                    className='w-full'
                    style={{
                      cursor: 'pointer',
                      backgroundColor: highlightedIndex === index ? 'whitesmoke' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    }}
                  >
                    {item}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default InputComponent;