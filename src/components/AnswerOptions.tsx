import { useSpeech } from '../hooks/useSpeech';
import { useApp } from '../contexts/AppContext';
import './AnswerOptions.css';

interface AnswerOptionsProps {
  answers: string[];
  selectedAnswer: number | number[] | null;
  correctAnswer: number | number[] | null;
  onSelect: (index: number | number[]) => void;
  disabled?: boolean;
  multipleAnswers?: boolean;
}

export function AnswerOptions({
  answers,
  selectedAnswer,
  correctAnswer,
  onSelect,
  disabled = false,
  multipleAnswers = false,
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

    if (multipleAnswers) {
      // Toggle selection for multiple answer questions
      const currentSelected = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      const newSelected = currentSelected.includes(index)
        ? currentSelected.filter(i => i !== index)
        : [...currentSelected, index];
      onSelect(newSelected);
    } else {
      onSelect(index);
    }
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

    const isSelected = Array.isArray(selectedAnswer)
      ? selectedAnswer.includes(index)
      : selectedAnswer === index;

    const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

    if (isSelected) {
      classes.push('selected');
    }

    if (correctAnswer !== null) {
      if (correctAnswers.includes(index)) {
        classes.push('correct');
      } else if (isSelected && !correctAnswers.includes(index)) {
        classes.push('incorrect');
      }
    }

    if (disabled) {
      classes.push('disabled');
    }

    return classes.join(' ');
  };

  const isSelected = (index: number) => {
    return Array.isArray(selectedAnswer)
      ? selectedAnswer.includes(index)
      : selectedAnswer === index;
  };

  return (
    <div className="answer-options">
      {multipleAnswers && (
        <div className="multiple-answers-hint">
          <span className="hint-icon">ℹ️</span>
          <span>Select all correct answers</span>
        </div>
      )}
      {answers.map((answer, index) => (
        <button
          key={index}
          className={getAnswerClassName(index)}
          onClick={() => handleAnswerClick(index)}
          disabled={disabled}
          aria-pressed={isSelected(index)}
          role={multipleAnswers ? 'checkbox' : 'radio'}
          aria-checked={multipleAnswers ? isSelected(index) : undefined}
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
