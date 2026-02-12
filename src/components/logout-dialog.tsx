'use client';

import { logoutDialogOpenAtom, sessionKeyAtom } from '@/atoms/ui-atoms';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { signOut } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

export function LogoutDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useAtom(logoutDialogOpenAtom);
  const setSessionKey = useSetAtom(sessionKeyAtom);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
            setOpen(false);
            setSessionKey((k) => k + 1);
            queryClient.clear();
            localStorage.clear();
          },
        },
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogContent showCloseButton={false}>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Log out</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to log out? You&apos;ll need to sign in again
            to access your account.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </ResponsiveDialogClose>
          <Button
            variant="destructive"
            className="text-white"
            onClick={(e) => handleLogout(e)}
            disabled={isLoading}
            isLoading={isLoading}
            loadingContent={'Logging out...'}
          >
            Log out
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
