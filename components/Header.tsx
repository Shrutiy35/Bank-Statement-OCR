
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-5 md:px-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          AI Bank Statement Analyzer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Intelligent OCR to convert your statements into structured data.
        </p>
      </div>
    </header>
  );
};

export default Header;
