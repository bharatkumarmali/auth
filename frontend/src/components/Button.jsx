import React from 'react'

function Button({ className, onClick }) {
    return (
        <button
            className={` rounded-md py-2 px-6 w-fit uppercase ${className}`}
            onClick={onClick}
        >
            login
        </button>
    )
}

export default Button