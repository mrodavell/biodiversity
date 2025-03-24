import React, { useEffect, useRef, useState } from 'react';
import TextField from '../textfield';
import { FaChevronDown } from 'react-icons/fa6';
import { FaChevronUp } from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';
import useOutsideClickListener from '../../hooks/useOutsideClickListener';

interface AutocompleteProps {
    placeholder?: string;
    selectedValue?: string;
    setSelectedValue?: (value: string) => void;
    initialSelectedText?: string;
    options?: { value: string; text: string }[];
    initialize?: () => void;
    onChange?: (value: string) => void;
    width?: string;
    height?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    options = [],
    selectedValue = "",
    setSelectedValue,
    initialize,
    initialSelectedText = "",
    onChange,
    height = '250px',
    width = '20.5%',
    placeholder = "Search"
}) => {

    const suggestionsRef = useRef(null);
    const [selectedText, setSelectedText] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const toggleShowSuggestions = () => setShowSuggestions(!showSuggestions);

    const handleOnChange = useDebouncedCallback((value: string) => {
        setShowSuggestions(true);
        if (onChange) {
            onChange(value);
        }
    }, 300);

    const handleSelectedValue = (text: string, value: string) => {
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

    useEffect(() => {
        setSelectedText(initialSelectedText);
    }, [initialSelectedText]);

    useOutsideClickListener({ onOutsideClick: toggleShowSuggestions, ref: suggestionsRef, state: showSuggestions });

    const ResultListComponent = () => {
        return options.length ? (
            <ul ref={suggestionsRef} className={`z-10 bg-white p-2 absolute mt-8 border border-gray-200 text-left w-[calc(${width}-2rem)] max-h-[${height}] overflow-x-hidden overflow-y-scroll`}>
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
            <div ref={suggestionsRef} className={`z-10 bg-white p-2 absolute mt-8 border border-gray-200 text-center w-[calc(${width}-2rem)]`}>
                <em>No options available.</em>
            </div>
        );
    };

    return (
        <div className="autocomplete flex flex-col flex-1 ">
            <TextField
                className='input-sm'
                placeholder={placeholder}
                type="text"
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