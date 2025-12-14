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
import { useEffect, useState } from 'react';
import { editingProjectAtom } from '../../atoms/task-dialogs';
import { PROJECT_COLORS } from '../../constants';
import { useUpdateProject } from '../../hooks/mutations/use-update-project';

export const EditProjectDialog = () => {
  const [project, setProject] = useAtom(editingProjectAtom);
  const updateProject = useUpdateProject();

  const [name, setName] = useState('');
  const [color, setColor] = useState<string>('blue');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setColor(project.color ?? 'blue');
    }
  }, [project]);

  const handleClose = () => {
    setProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !name.trim()) return;

    updateProject.mutate(
      {
        param: { id: project.id },
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
    <Dialog open={!!project} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project-name">Name</Label>
            <Input
              id="edit-project-name"
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
              disabled={!name.trim() || updateProject.isPending}
            >
              {updateProject.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
