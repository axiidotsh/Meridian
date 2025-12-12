import { useCancelSession } from '../mutations/use-cancel-session';
import { useCompleteSession } from '../mutations/use-complete-session';
import { useEndSessionEarly } from '../mutations/use-end-session-early';
import { usePauseSession } from '../mutations/use-pause-session';
import { useResumeSession } from '../mutations/use-resume-session';
import { useStartSession } from '../mutations/use-start-session';

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
