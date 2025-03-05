
import React from 'react';
import { Martini } from 'lucide-react';

interface DrinkButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const DrinkButton: React.FC<DrinkButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-navy-light to-navy-dark rounded-full shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
      
      <span className="relative flex items-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Finding a drink...
          </>
        ) : (
          <>
            <Martini className="w-5 h-5" />
            Have a drink
          </>
        )}
      </span>
      
      <span className="absolute -bottom-0 left-1/2 w-0 h-0.5 bg-gold group-hover:w-1/2 group-hover:transition-all group-hover:duration-300 ease-in-out"></span>
      <span className="absolute -bottom-0 right-1/2 w-0 h-0.5 bg-gold group-hover:w-1/2 group-hover:transition-all group-hover:duration-300 ease-in-out"></span>
    </button>
  );
};

export default DrinkButton;
