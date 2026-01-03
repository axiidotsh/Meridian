'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteAccount } from '@/hooks/use-delete-account';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { SettingSection } from './setting-section';

export const DangerZoneSettings = () => {
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function handleDeleteAccount() {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    deleteAccount.mutate(
      {},
      {
        onSuccess: () => {
          toast.success('Account deleted successfully');
          router.push('/sign-in');
        },
        onError: () => {
          toast.error('Failed to delete account');
        },
      }
    );
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      setDeleteConfirmation('');
    }
  }

  return (
    <SettingSection
      title="Delete Account"
      description="Permanently delete your account and all associated data"
    >
      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 pb-2">
            <Label htmlFor="delete-confirmation">
              Type <span className="font-mono font-semibold">DELETE</span> to
              confirm
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE here"
            />
          </div>
          <AlertDialogFooter className="grid grid-cols-2">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={
                  deleteConfirmation !== 'DELETE' || deleteAccount.isPending
                }
                isLoading={deleteAccount.isPending}
                loadingContent="Deleting..."
              >
                Delete Account
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingSection>
  );
};
