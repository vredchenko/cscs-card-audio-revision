import { useState, useEffect } from 'react';
import { db, type SessionRecord } from '../utils/db';
import './Statistics.css';

interface CategoryStat {
  category: string;
  correct: number;
  total: number;
  rate: number;
}

export function Statistics({ onClose }: { onClose: () => void }) {
  const [recentSessions, setRecentSessions] = useState<SessionRecord[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    overallRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    try {
      setIsLoading(true);

      // Load recent sessions
      const sessions = await db.getRecentSessions(10);
      setRecentSessions(sessions);

      // Load category statistics
      const catStats = await db.getCategoryStats();
      const categoryArray: CategoryStat[] = [];
      catStats.forEach((stats, category) => {
        categoryArray.push({ category, ...stats });
      });
      categoryArray.sort((a, b) => a.rate - b.rate); // Sort by rate (worst first)
      setCategoryStats(categoryArray);

      // Calculate overall statistics from all sessions
      const totalQ = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
      const totalC = sessions.reduce((sum, s) => sum + s.correctAnswers, 0);
      const totalI = sessions.reduce((sum, s) => sum + s.incorrectAnswers, 0);

      setOverallStats({
        totalQuestions: totalQ,
        totalCorrect: totalC,
        totalIncorrect: totalI,
        overallRate: totalQ > 0 ? (totalC / totalQ) * 100 : 0,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setIsLoading(false);
    }
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="statistics-overlay" onClick={onClose}>
      <div className="statistics-panel" onClick={(e) => e.stopPropagation()}>
        <div className="statistics-header">
          <h2>📊 Your Statistics</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close statistics">
            ✕
          </button>
        </div>

        <div className="statistics-content">
          {isLoading ? (
            <div className="statistics-loading">
              <div className="spinner" />
              <p>Loading statistics...</p>
            </div>
          ) : (
            <>
              {/* Overall Statistics */}
              <section className="stats-section">
                <h3>Overall Performance</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{overallStats.totalQuestions}</div>
                    <div className="stat-label">Total Questions</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{overallStats.totalCorrect}</div>
                    <div className="stat-label">Correct</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{overallStats.totalIncorrect}</div>
                    <div className="stat-label">Incorrect</div>
                  </div>
                  <div className="stat-card stat-card-highlight">
                    <div className="stat-value">{Math.round(overallStats.overallRate)}%</div>
                    <div className="stat-label">Success Rate</div>
                  </div>
                </div>
              </section>

              {/* Category Performance */}
              {categoryStats.length > 0 && (
                <section className="stats-section">
                  <h3>Category Performance</h3>
                  <div className="category-stats">
                    {categoryStats.map((cat) => (
                      <div key={cat.category} className="category-stat">
                        <div className="category-name">{cat.category}</div>
                        <div className="category-bar-container">
                          <div
                            className={`category-bar ${
                              cat.rate < 0.5
                                ? 'category-bar-poor'
                                : cat.rate < 0.7
                                ? 'category-bar-ok'
                                : 'category-bar-good'
                            }`}
                            style={{ width: `${cat.rate * 100}%` }}
                          />
                        </div>
                        <div className="category-score">
                          {cat.correct}/{cat.total} ({Math.round(cat.rate * 100)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Sessions */}
              {recentSessions.length > 0 && (
                <section className="stats-section">
                  <h3>Recent Sessions</h3>
                  <div className="sessions-list">
                    {recentSessions.map((session) => (
                      <div key={session.sessionId} className="session-item">
                        <div className="session-date">{formatDate(session.startTime)}</div>
                        <div className="session-score">
                          {session.correctAnswers}/{session.totalQuestions} (
                          {Math.round(session.scorePercentage)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State */}
              {recentSessions.length === 0 && (
                <div className="stats-empty">
                  <p>No statistics yet. Start answering questions to see your progress!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
