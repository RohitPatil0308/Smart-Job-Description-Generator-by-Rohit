import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-indigo-500 focus:border-green-500 dark:focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default Input;