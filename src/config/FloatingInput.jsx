import React from 'react';

const FloatingInput = ({
    label,
    type = "text",
    value,
    onChange,
    error,
    id,
    children,
    ...props
}) => {
    return (
        <div className='mb-4'>
            <div className="relative">
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    className={`peer block w-full rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 transition-all focus:outline-none focus:ring-0 
                        ${error
                            ? 'border-red-400 focus:border-red-400'
                            : 'border-gray-300 focus:border-[#F07B26]'
                        }`}
                    placeholder=" "
                    {...props}
                />
                {children}
                <label
                    htmlFor={id}
                    className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300 
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 
                        peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[#F07B26]"
                >
                    {label}
                </label>
            </div>
            {error && (
                <p className="text-red-400 text-xs mt-1">
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    );
};

export default FloatingInput;