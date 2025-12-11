import { useCancelSession } from './use-cancel-session';
import { useCompleteSession } from './use-complete-session';
import { useEndSessionEarly } from './use-end-session-early';
import { usePauseSession } from './use-pause-session';
import { useResumeSession } from './use-resume-session';
import { useStartSession } from './use-start-session';

export function useFocusSession() {
  const startSession = useStartSession();
  const pauseSession = usePauseSession();
  const resumeSession = useResumeSession();
  const completeSession = useCompleteSession();
  const cancelSession = useCancelSession();
  const endSessionEarly = useEndSessionEarly();

  return {
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    endSessionEarly,
  };
}
