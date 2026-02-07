'use client';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';

interface EmptyTrashDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export const EmptyTrashDialog = ({
  children,
  title,
  description,
  onConfirm,
  isPending,
}: EmptyTrashDialogProps) => {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {description}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </ResponsiveDialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            Delete permanently
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
