import { useState, useEffect } from 'react';
import { useApp } from './contexts/AppContext';
import { loadRevisionContent } from './utils/contentLoader';
import { prioritizeQuestions, smartShuffle } from './utils/smartRevision';
import { QuestionCard } from './components/QuestionCard';
import { AnswerOptions } from './components/AnswerOptions';
import { Feedback } from './components/Feedback';
import { ScoreDisplay } from './components/ScoreDisplay';
import { Settings } from './components/Settings';
import type { Question } from './types';
import './App.css';

function App() {
  const { settings, recordAnswer } = useApp();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load and prioritize questions on mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true);
        const content = await loadRevisionContent();
        setAllQuestions(content.questions);

        // Use smart revision algorithm
        const prioritized = await prioritizeQuestions(content.questions);
        const smartShuffled = smartShuffle(prioritized);
        setQuestions(smartShuffled);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('Failed to load revision content. Please refresh the page.');
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number | number[]) => {
    if (showFeedback) return;

    // For multiple answer questions, just update selection state
    if (currentQuestion.multipleAnswers) {
      setSelectedAnswer(answerIndex);
      return;
    }

    // For single answer questions, submit immediately
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;

    recordAnswer({
      questionId: currentQuestion.id,
      selectedAnswerIndex: answerIndex as number,
      isCorrect,
      timestamp: Date.now(),
    });

    setShowFeedback(true);
  };

  const handleSubmitMultipleAnswers = () => {
    if (!currentQuestion.multipleAnswers || showFeedback) return;

    const selected = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    const correct = currentQuestion.correctAnswerIndices || [];

    const isCorrect = selected.length === correct.length &&
                      selected.every(i => correct.includes(i));

    recordAnswer({
      questionId: currentQuestion.id,
      selectedAnswerIndices: selected,
      isCorrect,
      timestamp: Date.now(),
    });

    setShowFeedback(true);
  };

  const handleNext = async () => {
    setSelectedAnswer(null);
    setShowFeedback(false);

    // Move to next question or smart shuffle and restart
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Smart reshuffle for continuous practice
      const prioritized = await prioritizeQuestions(allQuestions);
      const smartShuffled = smartShuffle(prioritized);
      setQuestions(smartShuffled);
      setCurrentQuestionIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner" aria-label="Loading questions" />
        <p>Loading revision questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="app-error">
        <h2>No Questions Available</h2>
        <p>No revision questions found. Please check the data files.</p>
      </div>
    );
  }

  return (
    <div
      className="app"
      data-display-mode={settings.displayMode}
      data-font-size={settings.fontSize}
      data-font-family={settings.fontFamily}
    >
      <header className="app-header">
        <h1>CSCS Revision</h1>
        <Settings />
      </header>

      <main className="app-main container">
        <ScoreDisplay />

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <AnswerOptions
          answers={currentQuestion.answers}
          selectedAnswer={selectedAnswer}
          correctAnswer={showFeedback
            ? (currentQuestion.correctAnswerIndices || currentQuestion.correctAnswerIndex || null)
            : null}
          onSelect={handleAnswerSelect}
          disabled={showFeedback}
          multipleAnswers={currentQuestion.multipleAnswers}
        />

        {currentQuestion.multipleAnswers && !showFeedback && (
          <div className="submit-container">
            <button
              className="btn-submit"
              onClick={handleSubmitMultipleAnswers}
              disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
            >
              Submit Answer
            </button>
          </div>
        )}

        {showFeedback && (
          <Feedback
            isCorrect={(() => {
              if (currentQuestion.multipleAnswers && currentQuestion.correctAnswerIndices) {
                const selected = Array.isArray(selectedAnswer) ? selectedAnswer : [];
                const correct = currentQuestion.correctAnswerIndices;
                return selected.length === correct.length &&
                       selected.every(i => correct.includes(i));
              }
              return selectedAnswer === currentQuestion.correctAnswerIndex;
            })()}
            correctAnswer={
              currentQuestion.multipleAnswers && currentQuestion.correctAnswerIndices
                ? currentQuestion.correctAnswerIndices.map(i => currentQuestion.answers[i])
                : currentQuestion.answers[currentQuestion.correctAnswerIndex!]
            }
            explanation={currentQuestion.explanation}
            onNext={handleNext}
          />
        )}
      </main>

      <footer className="app-footer">
        <p className="footer-stats">
          Question Bank: {allQuestions.length} questions
        </p>
        <p className="footer-build">
          Build: {__GIT_SHA_SHORT__}
          {__GITHUB_RUN_NUMBER__ && ` (#${__GITHUB_RUN_NUMBER__})`}
        </p>
        {__GITHUB_RUN_ID__ && (
          <p className="footer-build-link">
            <a
              href={`https://github.com/vredchenko/cscs-card-audio-revision/actions/runs/${__GITHUB_RUN_ID__}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View CI/CD Run
            </a>
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
