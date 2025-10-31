
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center self-start p-3">
      <div className="flex items-center space-x-1.5 bg-gray-200 rounded-full px-3 py-2">
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;