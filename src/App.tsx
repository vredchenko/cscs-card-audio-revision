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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;

    // Record the answer
    recordAnswer({
      questionId: currentQuestion.id,
      selectedAnswerIndex: answerIndex,
      isCorrect,
      timestamp: Date.now(),
    });

    // Show feedback
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
          correctAnswer={showFeedback ? currentQuestion.correctAnswerIndex : null}
          onSelect={handleAnswerSelect}
          disabled={showFeedback}
        />

        {showFeedback && (
          <Feedback
            isCorrect={selectedAnswer === currentQuestion.correctAnswerIndex}
            correctAnswer={currentQuestion.answers[currentQuestion.correctAnswerIndex]}
            explanation={currentQuestion.explanation}
            onNext={handleNext}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>CSCS Health & Safety Revision</p>
        <p className="footer-note">
          Practice questions for CSCS certification preparation
        </p>
      </footer>
    </div>
  );
}

export default App;
