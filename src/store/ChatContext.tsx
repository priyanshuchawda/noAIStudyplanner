import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { generateGeminiResponse } from '../services/gemini';

export type QueryType = 'study' | 'homework' | 'timeManagement';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  type: QueryType;
  title: string;
  lastUpdated: string;
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
}

type ChatAction =
  | { type: 'CREATE_CONVERSATION'; payload: { title: string; type: QueryType } }
  | { type: 'LOAD_CONVERSATION'; payload: string }
  | { type: 'SEND_MESSAGE'; payload: { content: string; sender: 'user' | 'ai' } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  isLoading: false,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'CREATE_CONVERSATION': {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: action.payload.title,
        type: action.payload.type,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
      return {
        ...state,
        conversations: [...state.conversations, newConversation],
        activeConversation: newConversation,
      };
    }

    case 'LOAD_CONVERSATION': {
      const conversation = state.conversations.find(
        (conv) => conv.id === action.payload
      );
      return {
        ...state,
        activeConversation: conversation || null,
      };
    }

    case 'SEND_MESSAGE': {
      if (!state.activeConversation) {
        return state;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        content: action.payload.content,
        sender: action.payload.sender,
        timestamp: new Date().toISOString(),
      };

      const updatedConversation: Conversation = {
        ...state.activeConversation,
        messages: [...state.activeConversation.messages, newMessage],
        lastUpdated: new Date().toISOString(),
      };

      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        ),
        activeConversation: updatedConversation,
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    default:
      return state;
  }
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

// Helper function to generate AI responses using Gemini
export async function generateResponse(
  input: string,
  queryType: QueryType
): Promise<string> {
  const prompt = `You are an AI study assistant. The user's query type is: ${queryType}. 
User's message: ${input}

Please provide a helpful response focused on their study needs. Be concise but informative.`;

  return generateGeminiResponse(prompt);
}
