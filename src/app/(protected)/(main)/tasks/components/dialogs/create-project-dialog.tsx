'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { createProjectDialogAtom } from '../../atoms/task-dialogs';
import { PROJECT_COLORS } from '../../constants';
import { useCreateProject } from '../../hooks/mutations/use-create-project';

export const CreateProjectDialog = () => {
  const [open, setOpen] = useAtom(createProjectDialogAtom);
  const createProject = useCreateProject();

  const [name, setName] = useState('');
  const [color, setColor] = useState<string>('blue');

  const resetForm = () => {
    setName('');
    setColor('blue');
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject.mutate(
      {
        json: {
          name: name.trim(),
          color,
        },
      },
      {
        onSuccess: handleClose,
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              placeholder="Project name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border-2 transition-all',
                    c.class,
                    color === c.value
                      ? 'border-foreground'
                      : 'border-transparent'
                  )}
                  title={c.name}
                >
                  {color === c.value && <CheckIcon className="size-4" />}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createProject.isPending}
            >
              {createProject.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
