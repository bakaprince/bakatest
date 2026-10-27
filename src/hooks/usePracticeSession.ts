import { useState, useCallback, useEffect } from 'react';
import { PracticeSession, SessionSummaryData } from '../types/session';
import { Question, SessionQuestionState } from '../types/question';
import { questionService } from '../services/questionService';
import { sessionService } from '../services/sessionService';
import { statisticsService } from '../services/statisticsService';
import { calculateSessionSummary } from '../utils/scoring';

export function usePracticeSession(
  initialSession: PracticeSession,
  onCompleteSession: (summary: SessionSummaryData) => void
) {
  const [session, setSession] = useState<PracticeSession>(initialSession);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentQuestionId = session.questionIds[session.currentIndex];
  const currentQuestion: Question | undefined = questionService.getQuestionById(currentQuestionId);
  const currentState: SessionQuestionState | undefined = session.questionStates[currentQuestionId];

  // Sync local selected option when moving between questions
  useEffect(() => {
    if (currentState) {
      setSelectedOption(currentState.selectedAnswer);
    } else {
      setSelectedOption(null);
    }
    setValidationError(null);
  }, [currentQuestionId, currentState]);

  const handleSelectOption = useCallback((opt: 'A' | 'B' | 'C' | 'D') => {
    if (currentState?.isChecked) return; // Locked once checked!
    setSelectedOption(opt);
    setValidationError(null);

    if (!currentQuestion) return;

    // Immediately record user's selected choice in session state
    const isCorrect = opt === currentQuestion.correctAnswer;
    const updatedState: SessionQuestionState = {
      questionId: currentQuestion.id,
      selectedAnswer: opt,
      isChecked: false,
      isCorrect,
      isSkipped: false,
      timeSpentSeconds: currentState?.timeSpentSeconds || 0,
    };

    const updatedStates = {
      ...session.questionStates,
      [currentQuestion.id]: updatedState,
    };

    const updatedSession: PracticeSession = {
      ...session,
      questionStates: updatedStates,
      lastActiveTime: Date.now(),
    };

    setSession(updatedSession);
    sessionService.updateSession(updatedSession);
  }, [currentQuestion, currentState, session]);

  const handleCheckAnswer = useCallback(() => {
    if (!currentQuestion) return;
    if (currentState?.isChecked) return;

    if (!selectedOption) {
      setValidationError('Please select an option before checking.');
      return;
    }

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const now = Date.now();

    const updatedState: SessionQuestionState = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isChecked: true,
      isCorrect,
      isSkipped: false,
      timeSpentSeconds: currentState?.timeSpentSeconds || 0,
    };

    const updatedStates = {
      ...session.questionStates,
      [currentQuestion.id]: updatedState,
    };

    const updatedSession: PracticeSession = {
      ...session,
      questionStates: updatedStates,
      lastActiveTime: now,
    };

    setSession(updatedSession);
    sessionService.updateSession(updatedSession);

    // Record attempt into statistics
    statisticsService.recordAttempt({
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      timestamp: now,
      sessionId: session.id,
    });
  }, [currentQuestion, currentState, selectedOption, session]);

  const handleSkipQuestion = useCallback(() => {
    if (!currentQuestion) return;

    const updatedState: SessionQuestionState = {
      questionId: currentQuestion.id,
      selectedAnswer: null,
      isChecked: false,
      isCorrect: null,
      isSkipped: true,
      timeSpentSeconds: currentState?.timeSpentSeconds || 0,
    };

    const updatedStates = {
      ...session.questionStates,
      [currentQuestion.id]: updatedState,
    };

    const isLast = session.currentIndex === session.questionIds.length - 1;
    const nextIndex = isLast ? session.currentIndex : session.currentIndex + 1;

    const updatedSession: PracticeSession = {
      ...session,
      currentIndex: nextIndex,
      questionStates: updatedStates,
      lastActiveTime: Date.now(),
    };

    setSession(updatedSession);
    sessionService.updateSession(updatedSession);

    if (isLast) {
      // Complete practice
      finishSession(updatedSession);
    }
  }, [currentQuestion, currentState, session]);

  const finishSession = useCallback((finalSession?: PracticeSession) => {
    const s = finalSession || session;

    // Record any unchecked selected answers as attempts in statistics
    const now = Date.now();
    for (const qId of s.questionIds) {
      const state = s.questionStates[qId];
      if (state && !state.isChecked && state.selectedAnswer) {
        statisticsService.recordAttempt({
          questionId: qId,
          selectedOption: state.selectedAnswer,
          isCorrect: Boolean(state.isCorrect),
          timestamp: now,
          sessionId: s.id,
        });
      }
    }

    const summary = calculateSessionSummary(
      s.id,
      s.type,
      s.questionIds,
      s.questionStates,
      s.elapsedSeconds
    );
    statisticsService.recordCompletedSession(summary);
    sessionService.endSession(s);
    onCompleteSession(summary);
  }, [session, onCompleteSession]);

  const handleNextQuestion = useCallback(() => {
    const isLast = session.currentIndex === session.questionIds.length - 1;
    if (isLast) {
      finishSession();
      return;
    }

    const updatedSession = {
      ...session,
      currentIndex: session.currentIndex + 1,
      lastActiveTime: Date.now(),
    };
    setSession(updatedSession);
    sessionService.updateSession(updatedSession);
  }, [session, finishSession]);

  const handlePrevQuestion = useCallback(() => {
    if (session.currentIndex > 0) {
      const updatedSession = {
        ...session,
        currentIndex: session.currentIndex - 1,
        lastActiveTime: Date.now(),
      };
      setSession(updatedSession);
      sessionService.updateSession(updatedSession);
    }
  }, [session]);

  const handleJumpToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < session.questionIds.length) {
      const updatedSession = {
        ...session,
        currentIndex: index,
        lastActiveTime: Date.now(),
      };
      setSession(updatedSession);
      sessionService.updateSession(updatedSession);
    }
  }, [session]);

  const handleTimerTick = useCallback((elapsed: number) => {
    setSession(prev => {
      const updated = { ...prev, elapsedSeconds: elapsed };
      // Debounce saving every few seconds or let unmount save
      return updated;
    });
  }, []);

  return {
    session,
    currentQuestion,
    currentState,
    currentIndex: session.currentIndex,
    totalQuestions: session.questionIds.length,
    selectedOption,
    validationError,
    handleSelectOption,
    handleCheckAnswer,
    handleSkipQuestion,
    handleNextQuestion,
    handlePrevQuestion,
    handleJumpToQuestion,
    finishSession,
    handleTimerTick,
  };
}
