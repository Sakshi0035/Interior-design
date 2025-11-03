

import React, { useState, useCallback, useEffect } from 'react';
import ChatScreen from './ChatScreen';
import DashboardScreen from './DashboardScreen';
import SettingsScreen from './SettingsScreen';
import { type Screen, type Message } from '../types';
import { type Chat, type Content, type Part } from "@google/genai";
import { createChatSession } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import DatabaseSetupError from './DatabaseSetupError';
import NetworkError from './NetworkError';


const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [outgoingScreen, setOutgoingScreen] = useState<{screen: Screen, direction: 'left' | 'right'} | null>(null);

  useEffect(() => {
    const setupChat = async () => {
      if (!user) {
        setMessagesLoading(false);
        return;
      }

      setMessagesLoading(true);
      setDbError(false);
      setNetworkError(false);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      let currentMessages: Message[] = [];
      const initialMessageText = "Hello! Welcome to MagicFeel Studio LLP. I'm the official AI assistant. I can answer questions about our interior and landscape design services or help you get in touch with our team. How can I assist you today?";
      
      if (error) {
        console.error('Error fetching messages:', error.message);
        
        if (error.message.includes('Failed to fetch')) {
          setNetworkError(true);
          setMessagesLoading(false);
          return;
        }
        
        const isMissingTableError = error.message.includes("Could not find the table 'public.messages'") || 
                                    error.message.includes('relation "public.messages" does not exist');

        if (isMissingTableError) {
          setDbError(true);
          setMessagesLoading(false);
          return;
        }
        
        // Fallback to initial message in case of other errors
        currentMessages = [{
            id: '0',
            text: initialMessageText,
            sender: 'bot'
        }];
      } else if (data && data.length > 0) {
        currentMessages = data.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender as 'user' | 'bot',
          images: msg.images || [],
        }));
      } else {
        // No messages in DB, create and save the initial one.
        const initialMessage: Message = { id: '0', text: initialMessageText, sender: 'bot' };
        
        const { data: newMsgData, error: insertError } = await supabase
          .from('messages')
          .insert({
            user_id: user.id,
            text: initialMessage.text,
            sender: initialMessage.sender,
          })
          .select()
          .single();
        
        if (insertError) {
          console.error("Failed to save initial message:", insertError.message);
          
          if (insertError.message.includes('Failed to fetch')) {
              setNetworkError(true);
              setMessagesLoading(false);
              return;
          }
          // If insert fails (e.g., table missing), the next load will trigger the dbError screen.
          // For now, just show the welcome message without saving it.
          currentMessages = [initialMessage];
        } else {
          currentMessages = [{...initialMessage, id: newMsgData.id }];
        }
      }
      
      setMessages(currentMessages);

      const history: Content[] = currentMessages.map(msg => {
          const parts: Part[] = [];
          if(msg.text) parts.push({ text: msg.text });
          
          // Note: History with images is reconstructed differently for Gemini API
          // For simplicity, we'll only use text for history reconstruction here.
          // A more advanced implementation would handle base64 data correctly.

          return { role: msg.sender === 'user' ? 'user' : 'model', parts };
      }).filter(msg => msg.parts.length > 0);
      
      setChatSession(createChatSession(history));
      setMessagesLoading(false);
    };

    setupChat();
  }, [user]);

  if (networkError) {
    return <NetworkError />;
  }

  if (dbError) {
    return <DatabaseSetupError />;
  }

  const navigate = useCallback((screen: Screen) => {
    if (screen !== currentScreen) {
      const direction = screen === 'settings' ? 'right' : 'left';
      setOutgoingScreen({screen: currentScreen, direction});
      setCurrentScreen(screen);
      // Animation duration is 350ms
      setTimeout(() => setOutgoingScreen(null), 350);
    }
  }, [currentScreen]);

  const renderScreen = (screen: Screen, onNavigate: (s: Screen) => void) => {
    switch (screen) {
        case 'dashboard':
            return <DashboardScreen onNavigate={onNavigate} />;
        case 'settings':
            return <SettingsScreen onNavigate={onNavigate} />;
        default:
            return <DashboardScreen onNavigate={onNavigate} />;
    }
  }

  const currentScreenDirection = outgoingScreen ? outgoingScreen.direction : 'left';

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div key={currentScreen} className={`absolute inset-0 ${outgoingScreen ? (currentScreenDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left') : ''}`}>
          {renderScreen(currentScreen, navigate)}
      </div>
      {outgoingScreen && (
          <div key={outgoingScreen.screen} className={`absolute inset-0 ${outgoingScreen.direction === 'right' ? 'animate-slide-out-left' : 'animate-slide-out-right'}`}>
              {renderScreen(outgoingScreen.screen, navigate)}
          </div>
      )}


      {!isChatOpen && (
        <button
          id="chat-button"
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-6 right-6 w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 animate-pop-in z-20 group"
          aria-label="Open support chat"
        >
          <i className="fa-solid fa-ghost text-2xl group-hover:animate-wiggle"></i>
        </button>
      )}

      {isChatOpen && (
        <div className="absolute inset-0 z-30 bg-gray-50 animate-slide-in-bottom">
           <ChatScreen 
              onNavigateBack={() => setIsChatOpen(false)} 
              chatSession={chatSession}
              messages={messages}
              setMessages={setMessages}
              user={user}
              messagesLoading={messagesLoading}
            />
        </div>
      )}
    </div>
  );
};

export default MainApp;