import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AppSettings, SessionStats, UserAnswer } from '../types';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  sessionStats: SessionStats;
  recordAnswer: (answer: UserAnswer) => void;
  resetSession: () => void;
}

const defaultSettings: AppSettings = {
  displayMode: 'normal',
  ttsEnabled: true,
  ttsAutoPlay: false,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  ttsVolume: 1.0,
  fontSize: 'medium',
  showExplanations: true,
};

const defaultSessionStats: SessionStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  answersHistory: [],
  startTime: Date.now(),
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [sessionStats, setSessionStats] = useState<SessionStats>(defaultSessionStats);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const recordAnswer = useCallback((answer: UserAnswer) => {
    setSessionStats((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (answer.isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (answer.isCorrect ? 0 : 1),
      answersHistory: [...prev.answersHistory, answer],
    }));
  }, []);

  const resetSession = useCallback(() => {
    setSessionStats({
      ...defaultSessionStats,
      startTime: Date.now(),
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        sessionStats,
        recordAnswer,
        resetSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
