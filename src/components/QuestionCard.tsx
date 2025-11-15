import { useSpeech } from '../hooks/useSpeech';
import { useApp } from '../contexts/AppContext';
import type { Question } from '../types';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  const { settings } = useApp();
  const { speak, isSpeaking, cancel } = useSpeech({
    rate: settings.ttsRate,
    pitch: settings.ttsPitch,
    volume: settings.ttsVolume,
  });

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(question.question);
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-counter">
          Question {questionNumber} of {totalQuestions}
        </span>
        {settings.ttsEnabled && (
          <button
            className="btn-icon btn-speak"
            onClick={handleSpeak}
            aria-label={isSpeaking ? 'Stop reading question' : 'Read question aloud'}
            title={isSpeaking ? 'Stop' : 'Read aloud'}
          >
            {isSpeaking ? '🔇' : '🔊'}
          </button>
        )}
      </div>

      <div className="question-content">
        {question.image && (
          <div className="question-image">
            <img
              src={question.image.url}
              alt={question.image.alt}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {question.image.caption && (
              <p className="image-caption">{question.image.caption}</p>
            )}
          </div>
        )}
        <h2 className="question-text">{question.question}</h2>
      </div>

      {question.category && (
        <div className="question-category">
          <span className="category-badge">{question.category}</span>
        </div>
      )}
    </div>
  );
}
