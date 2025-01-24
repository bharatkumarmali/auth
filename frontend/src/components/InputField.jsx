import React from 'react'

function InputField({ placeholder, className, loginOnChange, inputValue }) {
    return (
        <input
            type="text"
            className={`w-full rounded-md outline-none py-2 px-3 ${className}`}   // className="border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
            placeholder={placeholder}
            onChange={loginOnChange}
            value={inputValue}
        />
    )
}

export default InputField