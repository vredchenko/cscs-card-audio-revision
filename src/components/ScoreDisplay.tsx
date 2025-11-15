import { useApp } from '../contexts/AppContext';
import './ScoreDisplay.css';

export function ScoreDisplay() {
  const { sessionStats } = useApp();
  const { totalQuestions, correctAnswers } = sessionStats;

  const percentage = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  return (
    <div className="score-display">
      <div className="score-item">
        <span className="score-label">Score:</span>
        <span className="score-value">
          {correctAnswers} / {totalQuestions}
        </span>
      </div>
      {totalQuestions > 0 && (
        <div className="score-item">
          <span className="score-percentage">{percentage}%</span>
        </div>
      )}
    </div>
  );
}
