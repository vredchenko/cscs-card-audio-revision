import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppSettings, SessionStats, UserAnswer } from '../types';
import { db, type QuestionStats } from '../utils/db';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  sessionStats: SessionStats;
  recordAnswer: (answer: UserAnswer) => void;
  resetSession: () => void;
  resetAllData: () => Promise<void>;
  currentSessionId: string;
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

const SETTINGS_STORAGE_KEY = 'cscs-revision-settings';

// Load settings from localStorage
function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
}

// Save settings to localStorage
function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Generate unique session ID
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [sessionStats, setSessionStats] = useState<SessionStats>(defaultSessionStats);
  const [currentSessionId] = useState<string>(generateSessionId());

  // Initialize database on mount
  useEffect(() => {
    db.init().catch((error) => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Save session data when stats change
  useEffect(() => {
    if (sessionStats.totalQuestions > 0) {
      db.saveSession({
        sessionId: currentSessionId,
        startTime: sessionStats.startTime,
        endTime: sessionStats.endTime,
        totalQuestions: sessionStats.totalQuestions,
        correctAnswers: sessionStats.correctAnswers,
        incorrectAnswers: sessionStats.incorrectAnswers,
        scorePercentage: sessionStats.totalQuestions > 0
          ? (sessionStats.correctAnswers / sessionStats.totalQuestions) * 100
          : 0,
      }).catch((error) => {
        console.error('Failed to save session:', error);
      });
    }
  }, [sessionStats, currentSessionId]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const recordAnswer = useCallback(async (answer: UserAnswer) => {
    // Update session stats (in-memory)
    setSessionStats((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (answer.isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (answer.isCorrect ? 0 : 1),
      answersHistory: [...prev.answersHistory, answer],
    }));

    // Save to IndexedDB
    try {
      // Record the answer
      await db.recordAnswer({
        questionId: answer.questionId,
        sessionId: currentSessionId,
        answeredAt: answer.timestamp,
        selectedAnswerIndex: answer.selectedAnswerIndex,
        correctAnswerIndex: -1, // Will be filled by caller
        isCorrect: answer.isCorrect,
        timeSpentMs: 0, // Can be enhanced later
        category: undefined, // Will be filled by caller
      });

      // Update question statistics
      const existingStats = await db.getQuestionStats(answer.questionId);

      let stats: QuestionStats;
      if (existingStats) {
        stats = {
          ...existingStats,
          totalAttempts: existingStats.totalAttempts + 1,
          correctAttempts: existingStats.correctAttempts + (answer.isCorrect ? 1 : 0),
          incorrectAttempts: existingStats.incorrectAttempts + (answer.isCorrect ? 0 : 1),
          successRate: 0, // Calculated below
          lastAttemptDate: answer.timestamp,
          averageTimeMs: existingStats.averageTimeMs, // Can be enhanced
          needsReview: false, // Calculated below
        };
      } else {
        stats = {
          questionId: answer.questionId,
          totalAttempts: 1,
          correctAttempts: answer.isCorrect ? 1 : 0,
          incorrectAttempts: answer.isCorrect ? 0 : 1,
          successRate: 0,
          lastAttemptDate: answer.timestamp,
          firstAttemptDate: answer.timestamp,
          averageTimeMs: 0,
          needsReview: false,
        };
      }

      // Calculate success rate
      stats.successRate = stats.correctAttempts / stats.totalAttempts;

      // Determine if question needs review
      // Mark for review if: success rate < 60% OR last 2 attempts were incorrect
      stats.needsReview = stats.successRate < 0.6 || stats.incorrectAttempts >= 2;

      await db.saveQuestionStats(stats);
    } catch (error) {
      console.error('Failed to record answer:', error);
    }
  }, [currentSessionId]);

  const resetSession = useCallback(() => {
    setSessionStats({
      ...defaultSessionStats,
      startTime: Date.now(),
    });
  }, []);

  const resetAllData = useCallback(async () => {
    await db.clearAllData();
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setSettings(defaultSettings);
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
        resetAllData,
        currentSessionId,
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
