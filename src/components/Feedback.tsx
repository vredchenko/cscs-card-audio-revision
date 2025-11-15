import { useSpeech } from '../hooks/useSpeech';
import { useApp } from '../contexts/AppContext';
import './Feedback.css';

interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  onNext: () => void;
}

export function Feedback({ isCorrect, correctAnswer, explanation, onNext }: FeedbackProps) {
  const { settings } = useApp();
  const { speak, isSpeaking, cancel } = useSpeech({
    rate: settings.ttsRate,
    pitch: settings.ttsPitch,
    volume: settings.ttsVolume,
  });

  const handleSpeakFeedback = () => {
    if (isSpeaking) {
      cancel();
    } else {
      const text = isCorrect
        ? 'Correct!'
        : `Incorrect. The correct answer is: ${correctAnswer}${explanation ? `. ${explanation}` : ''}`;
      speak(text);
    }
  };

  return (
    <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
      <div className="feedback-header">
        <div className="feedback-icon">
          {isCorrect ? '✓' : '✗'}
        </div>
        <h3 className="feedback-title">
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>
        {settings.ttsEnabled && (
          <button
            className="btn-icon btn-speak"
            onClick={handleSpeakFeedback}
            aria-label={isSpeaking ? 'Stop reading feedback' : 'Read feedback aloud'}
            title={isSpeaking ? 'Stop' : 'Read aloud'}
          >
            {isSpeaking ? '🔇' : '🔊'}
          </button>
        )}
      </div>

      {!isCorrect && (
        <div className="feedback-content">
          <p className="correct-answer">
            <strong>Correct answer:</strong> {correctAnswer}
          </p>
          {explanation && settings.showExplanations && (
            <p className="explanation">{explanation}</p>
          )}
        </div>
      )}

      <button
        className="btn-primary btn-next"
        onClick={onNext}
        aria-label="Continue to next question"
      >
        Next Question →
      </button>
    </div>
  );
}
