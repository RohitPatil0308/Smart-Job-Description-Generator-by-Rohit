import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-100 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:bg-green-500/50 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
    >
      {children}
    </button>
  );
};

export default Button;