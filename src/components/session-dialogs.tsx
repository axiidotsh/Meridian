import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SessionDialogsProps {
  dialogs: {
    showCancel: boolean;
    showEndEarly: boolean;
    showDiscard: boolean;
  };
  onOpenChange: (
    dialog: 'cancel' | 'endEarly' | 'discard',
    open: boolean
  ) => void;
  handlers: {
    onCancel: () => void;
    onEndEarly: () => void;
    onDiscard: () => void;
  };
  isPending: {
    cancel: boolean;
    endEarly: boolean;
  };
}

export function SessionDialogs({
  dialogs,
  onOpenChange,
  handlers,
  isPending,
}: SessionDialogsProps) {
  return (
    <>
      <Dialog
        open={dialogs.showCancel}
        onOpenChange={(open) => onOpenChange('cancel', open)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Cancel Focus Session?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this focus session? Your progress
              will not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep Going</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handlers.onCancel}
              disabled={isPending.cancel}
            >
              Cancel Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogs.showEndEarly}
        onOpenChange={(open) => onOpenChange('endEarly', open)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>End Session Early?</DialogTitle>
            <DialogDescription>
              Your progress will be saved. The session duration will be updated
              to reflect the actual time spent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep Going</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handlers.onEndEarly}
              disabled={isPending.endEarly}
            >
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogs.showDiscard}
        onOpenChange={(open) => onOpenChange('discard', open)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Discard Completed Session?</DialogTitle>
            <DialogDescription>
              Are you sure you want to discard this session? This action cannot
              be undone and the session will not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handlers.onDiscard}
              disabled={isPending.cancel}
            >
              Discard Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
