export type QueryType = 'study_advice' | 'homework_help' | 'time_management';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: QueryType;
}
