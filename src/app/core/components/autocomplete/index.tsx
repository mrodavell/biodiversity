import React, { useState } from 'react';
import TextField from '../textfield';
import { FaChevronDown } from 'react-icons/fa6';
import { FaChevronUp } from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';

interface AutocompleteProps {
    selectedValue?: string;
    setSelectedValue?: (value: string) => void;
    options: { value: string; text: string }[];
    initialize?: () => void;
    onChange?: (value: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    options = [],
    selectedValue = "",
    setSelectedValue,
    initialize,
    onChange
}) => {

    const [selectedText, setSelectedText] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const handleOnChange = useDebouncedCallback((value: string) => {
        console.log(value)
        setShowSuggestions(true);
        if (onChange) {
            onChange(value);
        }
    }, 300);

    const handleSelectedValue = (text: string, value: string) => {
        console.log({ text, value });
        if (setSelectedValue) {
            setSelectedValue(value);
        }
        setSelectedText(text);
        setShowSuggestions(false);
    };

    const handleFocus = () => {
        setShowSuggestions(true);
        if (initialize) {
            initialize();
        }
    }

    const ResultListComponent = () => {
        return options.length ? (
            <ul className="z-10 bg-white p-2 absolute mt-8 border border-gray-200 text-left w-[calc(20.5%-2rem)]">
                {options.map((value) => {
                    let className;
                    if (value.value === selectedValue) {
                        className = "suggestion-active";
                    }
                    return (
                        <li className={`hover:bg-zinc-200 hover:cursor-pointer px-2 ${className}`} key={value.value} onClick={() => handleSelectedValue(value.text, value.value)}>
                            {value.text}
                        </li>
                    );
                })}
            </ul>
        ) : (
            <div className="z-10 bg-white p-2 absolute mt-8 border border-gray-200 text-center w-[calc(20.5%-2rem)]">
                <em>No options available.</em>
            </div>
        );
    };

    return (
        <div className="autocomplete flex flex-col flex-1 ">
            <TextField
                className='input-sm'
                type="search"
                onChange={e => handleOnChange(e.target.value)}
                onFocus={handleFocus}
                value={selectedText}
                rightIcon={!showSuggestions ? <FaChevronDown size={10} /> : <FaChevronUp size={10} />}
            />
            {showSuggestions && <ResultListComponent />}
        </div>
    );
};

export default Autocomplete;