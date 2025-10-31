import React from 'react';
import ChatInterface from './ChatInterface';
import { type Chat } from "@google/genai";
import { type Message } from '../types';
import { type User } from '@supabase/supabase-js';
import Spinner from './Spinner';

interface ChatScreenProps {
  onNavigateBack: () => void;
  chatSession: Chat | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  user: User | null;
  messagesLoading: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigateBack, chatSession, messages, setMessages, user, messagesLoading }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm z-20 sticky top-0">
        <button onClick={onNavigateBack} className="text-gray-500 hover:text-black w-8">
          <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div className="text-center">
          <h1 className="font-semibold text-lg text-slate-800">MagicFeel AI</h1>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <div className="w-8"></div>
      </header>
      
      {messagesLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <ChatInterface 
          chatSession={chatSession} 
          messages={messages} 
          setMessages={setMessages}
          user={user} 
        />
      )}
    </div>
  );
};

export default ChatScreen;