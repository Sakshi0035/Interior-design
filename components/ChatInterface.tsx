
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Chat, type Part } from "@google/genai";
import { type Message } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { supabase } from '../services/supabaseClient';
import { type User } from '@supabase/supabase-js';


interface ChatInterfaceProps {
  chatSession: Chat | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  user: User | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatSession, messages, setMessages, user }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const newPreviews: Promise<string>[] = [];

      // FIX: Explicitly type the 'file' parameter to resolve type inference issues.
      files.forEach((file: File) => {
        if (file.size > 4 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Please select images smaller than 4MB.`);
          return;
        }
        validFiles.push(file);
        newPreviews.push(new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        }));
      });
      
      Promise.all(newPreviews).then(previews => {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...previews]);
      });
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const sendMessage = useCallback(async (messageText: string) => {
    const trimmedText = messageText.trim();
    if ((!trimmedText && selectedFiles.length === 0) || isLoading || !chatSession) return;

    const currentFiles = [...selectedFiles];
    const currentPreviews = [...imagePreviews];

    setInputValue('');
    setSelectedFiles([]);
    setImagePreviews([]);

    const userMessage: Message = { 
      id: Date.now().toString(), 
      text: trimmedText, 
      sender: 'user', 
      images: currentPreviews
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to Supabase
    if (user) {
        supabase.from('messages').insert({
            user_id: user.id,
            text: trimmedText,
            sender: 'user',
            images: currentPreviews,
        }).then(({ error }) => {
            if (error) console.error("Error saving user message:", error.message);
        });
    }


    setIsLoading(true);

    // FIX: Declare botMessageId outside the try block to make it accessible in the catch block.
    let botMessageId: string | null = null;

    try {
      const parts: Part[] = [];

      for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        const preview = currentPreviews[i];
        const base64Data = preview.split(',')[1];
        parts.push({
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        });
      }

      if (trimmedText) {
        parts.push({ text: trimmedText });
      }

      const stream = await chatSession.sendMessageStream({ message: parts });
      
      let botResponseText = '';
      botMessageId = `bot-${Date.now()}`;
      
      setMessages(prev => [...prev, { id: botMessageId!, text: '', sender: 'bot' }]);

      for await (const chunk of stream) {
        botResponseText += chunk.text;
        setMessages(prev =>
          prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: botResponseText } : msg
          )
        );
      }
      
      // Save bot message to Supabase
      if (user && botResponseText.trim()) {
        supabase.from('messages').insert({
            user_id: user.id,
            text: botResponseText,
            sender: 'bot',
        }).then(({ error }) => {
            if (error) console.error("Error saving bot message:", error.message);
        });
      }

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        text: "Sorry, I'm having a little trouble thinking right now. Please try again later.",
        sender: 'bot'
      };
      setMessages(prev => [...prev.filter(msg => msg.id !== botMessageId), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatSession, selectedFiles, imagePreviews, setMessages, user]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const suggestionPrompts = [
    "What services do you offer?",
    "How can I book a consultation?",
    "Tell me about your company.",
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>
      
      {!isLoading && messages.length <= 1 && (
        <div className="px-4 pb-2">
            <div className="flex overflow-x-auto space-x-2 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {suggestionPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="flex-shrink-0 px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
        </div>
      )}

      <footer className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 sticky bottom-0">
        {imagePreviews.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto mb-2 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative flex-shrink-0 w-20 h-20 p-1 border border-gray-300 rounded-md">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded" />
                <button 
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label="Remove image"
                >
                  &#x2715;
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            multiple
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-12 h-12 rounded-full border-2 border-gray-200 bg-gray-50 text-gray-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-paperclip"></i>
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 p-3 rounded-full border-2 border-gray-200 bg-gray-50 focus:border-yellow-500 outline-none transition text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={(!inputValue.trim() && selectedFiles.length === 0) || isLoading}
            className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-transform"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </footer>
    </>
  );
};

export default ChatInterface;
