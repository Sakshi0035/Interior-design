import React from 'react';
import { type Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-yellow-500 text-white self-end rounded-tl-xl rounded-tr-xl rounded-bl-xl'
    : 'bg-gray-200 text-gray-800 self-start rounded-tr-xl rounded-tl-xl rounded-br-xl';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div className={`max-w-xs md:max-w-md shadow-sm ${bubbleClasses} ${!message.images?.length && !message.text ? 'p-0' : 'px-4 py-3'}`}>
        {message.images && message.images.length > 0 && (
          <div className={`grid gap-2 ${message.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${message.text ? 'mb-2' : ''}`}>
            {message.images.map((imgSrc, index) => (
              <img 
                key={index}
                src={imgSrc} 
                alt={`User upload ${index + 1}`} 
                className="rounded-lg w-full h-auto object-cover" 
              />
            ))}
          </div>
        )}
        {message.text && (
            <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;