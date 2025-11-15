import { useSpeech } from '../hooks/useSpeech';
import { useApp } from '../contexts/AppContext';
import './AnswerOptions.css';

interface AnswerOptionsProps {
  answers: string[];
  selectedAnswer: number | null;
  correctAnswer: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export function AnswerOptions({
  answers,
  selectedAnswer,
  correctAnswer,
  onSelect,
  disabled = false,
}: AnswerOptionsProps) {
  const { settings } = useApp();
  const { speak, isSpeaking, cancel } = useSpeech({
    rate: settings.ttsRate,
    pitch: settings.ttsPitch,
    volume: settings.ttsVolume,
  });

  const handleAnswerClick = (index: number) => {
    if (disabled) return;

    // Speak the answer if auto-play is enabled
    if (settings.ttsEnabled && settings.ttsAutoPlay) {
      if (isSpeaking) cancel();
      speak(answers[index]);
    }

    onSelect(index);
  };

  const handleSpeakAnswer = (answer: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      cancel();
    } else {
      speak(answer);
    }
  };

  const getAnswerClassName = (index: number) => {
    const classes = ['answer-option'];

    if (selectedAnswer === index) {
      classes.push('selected');
    }

    if (correctAnswer !== null) {
      if (index === correctAnswer) {
        classes.push('correct');
      } else if (index === selectedAnswer && index !== correctAnswer) {
        classes.push('incorrect');
      }
    }

    if (disabled) {
      classes.push('disabled');
    }

    return classes.join(' ');
  };

  return (
    <div className="answer-options">
      {answers.map((answer, index) => (
        <button
          key={index}
          className={getAnswerClassName(index)}
          onClick={() => handleAnswerClick(index)}
          disabled={disabled}
          aria-pressed={selectedAnswer === index}
        >
          <span className="answer-letter">
            {String.fromCharCode(65 + index)}
          </span>
          <span className="answer-text">{answer}</span>
          {settings.ttsEnabled && !settings.ttsAutoPlay && (
            <button
              className="btn-speak-answer"
              onClick={(e) => handleSpeakAnswer(answer, e)}
              aria-label={`Read answer ${String.fromCharCode(65 + index)} aloud`}
              title="Read aloud"
            >
              🔊
            </button>
          )}
        </button>
      ))}
    </div>
  );
}
