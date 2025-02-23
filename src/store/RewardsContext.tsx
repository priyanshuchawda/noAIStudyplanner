import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Reward, UserRewards } from '../types';

interface RewardsState extends UserRewards {
  isLoading: boolean;
  error: string | null;
}

type RewardsAction =
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'UNLOCK_REWARD'; payload: Reward }
  | { type: 'SET_ERROR'; payload: string | null };

const defaultRewards: Reward[] = [
  {
    id: '1',
    title: '3 Day Streak',
    description: 'Study for 3 days in a row',
    points: 100,
    type: 'streak',
    icon: '🔥'
  },
  {
    id: '2',
    title: 'Week Warrior',
    description: 'Complete a 7-day study streak',
    points: 300,
    type: 'streak',
    icon: '⚔️'
  },
  {
    id: '3',
    title: 'Focus Master',
    description: 'Complete 5 study sessions with 90%+ focus score',
    points: 200,
    type: 'achievement',
    icon: '🎯'
  }
];

const initialState: RewardsState = {
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  rewardsEarned: [],
  isLoading: false,
  error: null
};

const rewardsReducer = (state: RewardsState, action: RewardsAction): RewardsState => {
  switch (action.type) {
    case 'ADD_POINTS':
      return {
        ...state,
        totalPoints: state.totalPoints + action.payload
      };
    case 'UPDATE_STREAK':
      return {
        ...state,
        currentStreak: action.payload,
        longestStreak: Math.max(state.longestStreak, action.payload)
      };
    case 'UNLOCK_REWARD':
      return {
        ...state,
        rewardsEarned: [...state.rewardsEarned, { ...action.payload, unlockedAt: new Date().toISOString() }]
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

const RewardsContext = createContext<{
  state: RewardsState;
  dispatch: React.Dispatch<RewardsAction>;
  checkAndAwardStreak: () => void;
} | null>(null);

export const RewardsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(rewardsReducer, initialState);

  const checkAndAwardStreak = () => {
    // Check for streak-based rewards
    if (state.currentStreak === 3 && !state.rewardsEarned.some(r => r.id === '1')) {
      const reward = defaultRewards.find(r => r.id === '1');
      if (reward) {
        dispatch({ type: 'UNLOCK_REWARD', payload: reward });
        dispatch({ type: 'ADD_POINTS', payload: reward.points });
      }
    }
    if (state.currentStreak === 7 && !state.rewardsEarned.some(r => r.id === '2')) {
      const reward = defaultRewards.find(r => r.id === '2');
      if (reward) {
        dispatch({ type: 'UNLOCK_REWARD', payload: reward });
        dispatch({ type: 'ADD_POINTS', payload: reward.points });
      }
    }
  };

  return (
    <RewardsContext.Provider value={{ state, dispatch, checkAndAwardStreak }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};