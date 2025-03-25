import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar({ onApply , placeholderSubject }) {
    const [inputVal, setInputVal] = useState("");
    const [hasTyped, setHasTyped] = useState(false); 

    const handleSearching = () => {
        if (inputVal !== "") {
            setInputVal(""); 
            setHasTyped(false); 
            onApply("");
        }
    };

    useEffect(() => {
        if (hasTyped) {
            onApply(inputVal); 
        }
    }, [inputVal, hasTyped]);

    return (
        <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative">
                <input
                    className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder={placeholderSubject}
                    value={inputVal}
                    onChange={(e) => {
                        setInputVal(e.target.value);
                        setHasTyped(true); 
                    }}
                />
                <button
                    className="absolute top-0 right-0 h-full flex items-center rounded bg-red-600 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-red-800 focus:shadow-none active:bg-red-800 hover:bg-red-800 active:shadow-none"
                    type="button"
                    onClick={handleSearching}
                >
                    {inputVal !== "" ? <p className='cursor-pointer'>✖</p> : <FontAwesomeIcon icon={faSearch} />}
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
