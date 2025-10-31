export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  images?: string[];
}

export type Screen = 'chat' | 'dashboard' | 'settings';
