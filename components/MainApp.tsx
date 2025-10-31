
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
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [networkError, setNetworkError] = useState(false);

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
    setCurrentScreen(screen);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'chat':
        return <ChatScreen 
                  onNavigateBack={() => navigate('dashboard')} 
                  chatSession={chatSession}
                  messages={messages}
                  setMessages={setMessages}
                  user={user}
                  messagesLoading={messagesLoading}
                />;
      case 'dashboard':
        return <DashboardScreen onNavigate={navigate} />;
      case 'settings':
        return <SettingsScreen onNavigate={navigate} />;
      default:
        return <DashboardScreen onNavigate={navigate} />;
    }
  };

  return renderScreen();
};

export default MainApp;
