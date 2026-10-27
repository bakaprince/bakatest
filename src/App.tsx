import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { ResultsPage } from './pages/ResultsPage';
import { ReviewPage } from './pages/ReviewPage';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { ShortcutsModal } from './components/ShortcutsModal';
import { sessionService } from './services/sessionService';
import { statisticsService } from './services/statisticsService';
import { PracticeSession, SessionSummaryData, TimerConfig } from './types/session';

type ViewMode = 'home' | 'practice' | 'results' | 'review';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return sessionService.getActiveSession() ? 'practice' : 'home';
  });

  const [activeSession, setActiveSession] = useState<PracticeSession | null>(() => {
    return sessionService.getActiveSession();
  });

  const [lastSummary, setLastSummary] = useState<SessionSummaryData | null>(null);
  const [lastSessionStates, setLastSessionStates] = useState<any>({});
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Start a new session
  const handleStartSession = (
    length: number | 'all',
    timerConfig: TimerConfig,
    retryIds?: string[]
  ) => {
    const sessionType = retryIds && retryIds.length > 0 ? 'retry' : 'practice';
    const newSession = sessionService.createPracticeSession(
      length,
      timerConfig,
      sessionType,
      retryIds
    );
    setActiveSession(newSession);
    setViewMode('practice');
  };

  const handleResumeSession = () => {
    const session = sessionService.getActiveSession();
    if (session) {
      setActiveSession(session);
      setViewMode('practice');
    }
  };

  const handleFinishSession = (summary: SessionSummaryData) => {
    if (activeSession) {
      setLastSessionStates(activeSession.questionStates);
    }
    setLastSummary(summary);
    setActiveSession(null);
    setViewMode('results');
  };

  const handleExitToHome = () => {
    setViewMode('home');
  };

  const handleRetryIncorrect = (incorrectIds: string[]) => {
    const defaultTimer: TimerConfig = {
      mode: 'elapsed',
      countdownMinutes: null,
    };
    handleStartSession('all', defaultTimer, incorrectIds);
  };

  const handleReviewAnswers = () => {
    setViewMode('review');
  };

  const handleResetAllProgress = () => {
    statisticsService.resetAll();
    sessionService.clearActiveSession();
    setActiveSession(null);
    setLastSummary(null);
    setShowResetConfirm(false);
    setViewMode('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <AppHeader
        title="BakaTest"
        subtitle="Cloud Computing MCQ Practice Platform"
        onHomeClick={() => setViewMode('home')}
        onResetClick={() => setShowResetConfirm(true)}
        onShowShortcuts={() => setShowShortcutsModal(true)}
      />

      <main className="flex-1 pb-16">
        {viewMode === 'home' && (
          <HomePage
            onStartSession={handleStartSession}
            onResumeSession={handleResumeSession}
            hasActiveSession={Boolean(activeSession || sessionService.getActiveSession())}
          />
        )}

        {viewMode === 'practice' && activeSession && (
          <PracticePage
            session={activeSession}
            onFinishSession={handleFinishSession}
            onExitToHome={handleExitToHome}
            onShowShortcuts={() => setShowShortcutsModal(true)}
          />
        )}

        {viewMode === 'results' && lastSummary && (
          <ResultsPage
            summary={lastSummary}
            onRetryIncorrect={handleRetryIncorrect}
            onReviewAnswers={handleReviewAnswers}
            onStartNewPractice={() => setViewMode('home')}
            onReturnHome={() => setViewMode('home')}
          />
        )}

        {viewMode === 'review' && lastSummary && (
          <ReviewPage
            summary={lastSummary}
            questionStates={lastSessionStates}
            onBackToResults={() => setViewMode('results')}
            onReturnHome={() => setViewMode('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        <p className="font-mono">
          BakaTest Cloud Computing Practice · Consolidated Question Bank (268 Questions)
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          Assignment Weeks 1–12 & Mock Exams 1–5 · All data locally preserved
        </p>
      </footer>

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showResetConfirm}
        title="Reset All Saved Progress?"
        message="This action will permanently erase your completed sessions, question mastery history, and active practice state. This cannot be undone."
        confirmLabel="Reset Everything"
        cancelLabel="Keep Progress"
        isDestructive={true}
        onConfirm={handleResetAllProgress}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
}

export default App;
