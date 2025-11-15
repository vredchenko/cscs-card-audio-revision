/**
 * IndexedDB wrapper for persistent storage
 * Stores question statistics, answer history, and session data
 */

const DB_NAME = 'cscs-revision-db';
const DB_VERSION = 1;

// Store names
const STORES = {
  QUESTION_STATS: 'questionStats',
  ANSWER_HISTORY: 'answerHistory',
  SESSIONS: 'sessions',
} as const;

export interface QuestionStats {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  successRate: number;
  lastAttemptDate: number;
  firstAttemptDate: number;
  averageTimeMs: number;
  needsReview: boolean;
  category?: string;
}

export interface AnswerRecord {
  id?: number;
  questionId: string;
  sessionId: string;
  answeredAt: number;
  selectedAnswerIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
  timeSpentMs: number;
  category?: string;
}

export interface SessionRecord {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
}

class RevisionDB {
  private db: IDBDatabase | null = null;

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Question Statistics Store
        if (!db.objectStoreNames.contains(STORES.QUESTION_STATS)) {
          const statsStore = db.createObjectStore(STORES.QUESTION_STATS, {
            keyPath: 'questionId',
          });
          statsStore.createIndex('successRate', 'successRate', { unique: false });
          statsStore.createIndex('needsReview', 'needsReview', { unique: false });
          statsStore.createIndex('lastAttemptDate', 'lastAttemptDate', { unique: false });
        }

        // Answer History Store
        if (!db.objectStoreNames.contains(STORES.ANSWER_HISTORY)) {
          const historyStore = db.createObjectStore(STORES.ANSWER_HISTORY, {
            keyPath: 'id',
            autoIncrement: true,
          });
          historyStore.createIndex('questionId', 'questionId', { unique: false });
          historyStore.createIndex('sessionId', 'sessionId', { unique: false });
          historyStore.createIndex('answeredAt', 'answeredAt', { unique: false });
          historyStore.createIndex('category', 'category', { unique: false });
        }

        // Sessions Store
        if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
          const sessionsStore = db.createObjectStore(STORES.SESSIONS, {
            keyPath: 'sessionId',
          });
          sessionsStore.createIndex('startTime', 'startTime', { unique: false });
        }
      };
    });
  }

  /**
   * Save or update question statistics
   */
  async saveQuestionStats(stats: QuestionStats): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.QUESTION_STATS], 'readwrite');
      const store = transaction.objectStore(STORES.QUESTION_STATS);
      const request = store.put(stats);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get statistics for a specific question
   */
  async getQuestionStats(questionId: string): Promise<QuestionStats | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.QUESTION_STATS], 'readonly');
      const store = transaction.objectStore(STORES.QUESTION_STATS);
      const request = store.get(questionId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all question statistics
   */
  async getAllQuestionStats(): Promise<QuestionStats[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.QUESTION_STATS], 'readonly');
      const store = transaction.objectStore(STORES.QUESTION_STATS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get questions that need review (low success rate or not attempted recently)
   */
  async getQuestionsNeedingReview(): Promise<QuestionStats[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.QUESTION_STATS], 'readonly');
      const store = transaction.objectStore(STORES.QUESTION_STATS);
      const index = store.index('needsReview');
      const request = index.getAll(IDBKeyRange.only(1)); // 1 = true in IndexedDB

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Record an answer
   */
  async recordAnswer(answer: AnswerRecord): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.ANSWER_HISTORY], 'readwrite');
      const store = transaction.objectStore(STORES.ANSWER_HISTORY);
      const request = store.add(answer);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get answer history for a specific question
   */
  async getAnswerHistory(questionId: string): Promise<AnswerRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.ANSWER_HISTORY], 'readonly');
      const store = transaction.objectStore(STORES.ANSWER_HISTORY);
      const index = store.index('questionId');
      const request = index.getAll(questionId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get recent answer history (last N answers)
   */
  async getRecentAnswers(limit: number = 50): Promise<AnswerRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.ANSWER_HISTORY], 'readonly');
      const store = transaction.objectStore(STORES.ANSWER_HISTORY);
      const index = store.index('answeredAt');
      const request = index.openCursor(null, 'prev');
      const results: AnswerRecord[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save session data
   */
  async saveSession(session: SessionRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SESSIONS], 'readwrite');
      const store = transaction.objectStore(STORES.SESSIONS);
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get recent sessions
   */
  async getRecentSessions(limit: number = 10): Promise<SessionRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SESSIONS], 'readonly');
      const store = transaction.objectStore(STORES.SESSIONS);
      const index = store.index('startTime');
      const request = index.openCursor(null, 'prev');
      const results: SessionRecord[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data (for reset functionality)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [STORES.QUESTION_STATS, STORES.ANSWER_HISTORY, STORES.SESSIONS],
        'readwrite'
      );

      const statsStore = transaction.objectStore(STORES.QUESTION_STATS);
      const historyStore = transaction.objectStore(STORES.ANSWER_HISTORY);
      const sessionsStore = transaction.objectStore(STORES.SESSIONS);

      statsStore.clear();
      historyStore.clear();
      sessionsStore.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Get category performance statistics
   */
  async getCategoryStats(): Promise<Map<string, { correct: number; total: number; rate: number }>> {
    const allAnswers = await this.getRecentAnswers(1000);
    const categoryMap = new Map<string, { correct: number; total: number; rate: number }>();

    allAnswers.forEach((answer) => {
      if (!answer.category) return;

      const stats = categoryMap.get(answer.category) || { correct: 0, total: 0, rate: 0 };
      stats.total++;
      if (answer.isCorrect) stats.correct++;
      stats.rate = stats.correct / stats.total;
      categoryMap.set(answer.category, stats);
    });

    return categoryMap;
  }
}

// Create singleton instance
export const db = new RevisionDB();
