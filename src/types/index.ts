/**
 * TypeScript types for CSCS Revision content
 * Matches the JSON schema in public/data/schema.json
 */

export interface QuestionImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Question {
  id: string;
  question: string;
  image?: QuestionImage;
  answers: string[];
  correctAnswerIndex?: number; // For single answer questions (backward compatible)
  correctAnswerIndices?: number[]; // For multiple answer questions
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  multipleAnswers?: boolean; // Indicates if multiple answers are required
}

export interface ContentMetadata {
  title: string;
  description: string;
  categories?: string[];
  author?: string;
  lastUpdated?: string;
}

export interface RevisionContent {
  version: string;
  metadata: ContentMetadata;
  questions: Question[];
}

/**
 * Application state types
 */

export interface UserAnswer {
  questionId: string;
  selectedAnswerIndex?: number; // For single answer questions
  selectedAnswerIndices?: number[]; // For multiple answer questions
  isCorrect: boolean;
  timestamp: number;
}

export interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  answersHistory: UserAnswer[];
  startTime: number;
  endTime?: number;
}

export interface AppSettings {
  displayMode: 'normal' | 'dyslexia';
  ttsEnabled: boolean;
  ttsAutoPlay: boolean;
  ttsRate: number; // Speech rate: 0.5 to 2.0
  ttsPitch: number; // Speech pitch: 0 to 2.0
  ttsVolume: number; // Volume: 0 to 1.0
  fontSize: 'small' | 'medium' | 'large';
  showExplanations: boolean;
}

export type QuestionStatus = 'unanswered' | 'correct' | 'incorrect';
